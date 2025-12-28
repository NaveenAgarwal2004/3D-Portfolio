'use client';

import { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { detectDevice } from '@/lib/utils/deviceDetection';

interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memoryUsage: number;
}

interface DeviceSettings {
  isMobile: boolean;
  recommendedSettings: { 
    targetFPS: number;
  };
}

export function PerformanceOverlay() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [device, setDevice] = useState<DeviceSettings>({
    isMobile: false,
    recommendedSettings: { targetFPS: 60 },
  });
  
  useEffect(() => {
    setDevice(detectDevice() as DeviceSettings);
  }, []);
  
  const metrics = usePerformanceMonitor(
    (metrics: PerformanceMetrics) => {
      // Trigger warning on budget violation
      const targetFPS = device.recommendedSettings.targetFPS;
      
      if (metrics.fps < targetFPS * 0.8) {
        setWarningMessage(`⚠️ Low FPS: ${metrics.fps} (target: ${targetFPS})`);
        setShowWarning(true);
        
        // Log to console for debugging
        console.warn('Performance budget violation:', {
          fps: metrics.fps,
          target: targetFPS,
          drawCalls: metrics.drawCalls,
          triangles: metrics.triangles,
          memoryUsage: `${metrics.memoryUsage.toFixed(0)}MB`,
        });
      } else {
        setShowWarning(false);
      }
    },
    {
      targetFPS: device.recommendedSettings.targetFPS,
      maxDrawCalls: 1000,
      maxTriangles: 500000,
      maxMemory: device.isMobile ? 200 : 512,
    }
  );
  
  // Auto-hide warning after 5 seconds
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => setShowWarning(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);
  
  // Development mode: Show FPS counter
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      {/* Performance Warning */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-warning/90 backdrop-blur-sm border border-warning rounded-lg shadow-lg animate-pulse">
          <p className="text-white text-sm font-medium">{warningMessage}</p>
        </div>
      )}
      
      {/* Dev FPS Counter */}
      {isDev && (
        <div className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-obsidian/80 backdrop-blur-sm border border-ionizedBlue/30 rounded text-xs font-mono text-white">
          <div>FPS: {metrics.fps}</div>
          <div>Draw Calls: {metrics.drawCalls}</div>
          <div>Triangles: {metrics.triangles.toLocaleString()}</div>
          <div>Memory: {metrics.memoryUsage.toFixed(0)}MB</div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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

// This component MUST be rendered inside the R3F Canvas since it uses useThree
export function PerformanceOverlay() {
  const { gl } = useThree();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0,
  });
  const [device, setDevice] = useState<DeviceSettings>({
    isMobile: false,
    recommendedSettings: { targetFPS: 60 },
  });
  
  const frameCountRef = { current: 0 };
  const lastTimeRef = { current: performance.now() };
  
  useEffect(() => {
    setDevice(detectDevice() as DeviceSettings);
  }, []);
  
  useFrame(() => {
    frameCountRef.current += 1;
    
    // Calculate FPS every 60 frames
    if (frameCountRef.current % 60 === 0) {
      const now = performance.now();
      const delta = (now - lastTimeRef.current) / 1000;
      const fps = Math.round(60 / delta);
      
      const info = gl.info;
      const newMetrics: PerformanceMetrics = {
        fps,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
      };
      
      setMetrics(newMetrics);
      lastTimeRef.current = now;
      
      // Check budget violations
      const targetFPS = device.recommendedSettings.targetFPS;
      if (fps < targetFPS * 0.8) {
        setWarningMessage(`⚠️ Low FPS: ${fps} (target: ${targetFPS})`);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  });
  
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
    <Html fullscreen style={{ pointerEvents: 'none' }}>
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
    </Html>
  );
}

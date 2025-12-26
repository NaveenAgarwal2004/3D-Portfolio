'use client';

import { useEffect, useState, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memoryUsage: number;
}

interface PerformanceBudget {
  targetFPS: number;
  maxDrawCalls: number;
  maxTriangles: number;
  maxMemory: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  targetFPS: 60,
  maxDrawCalls: 1000,
  maxTriangles: 500000,
  maxMemory: 512, // MB
};

export function usePerformanceMonitor(
  onBudgetViolation?: (metrics: PerformanceMetrics) => void,
  budget: PerformanceBudget = DEFAULT_BUDGET
) {
  const { gl, scene } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0,
  });
  
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());
  
  useFrame(() => {
    setFrameCount((prev) => prev + 1);
    
    // Calculate FPS every 60 frames
    if (frameCount % 60 === 0) {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      const fps = Math.round(60 / delta);
      
      const info = gl.info;
      const newMetrics: PerformanceMetrics = {
        fps,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
      };
      
      setMetrics(newMetrics);
      setLastTime(now);
      
      // Check budget violations
      if (
        fps < budget.targetFPS * 0.8 ||
        newMetrics.drawCalls > budget.maxDrawCalls ||
        newMetrics.triangles > budget.maxTriangles ||
        newMetrics.memoryUsage > budget.maxMemory
      ) {
        onBudgetViolation?.(newMetrics);
      }
    }
  });
  
  return metrics;
}
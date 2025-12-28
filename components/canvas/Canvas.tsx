'use client';

import { Suspense, ReactNode, useState, useEffect } from 'react';
import { detectDevice } from '@/lib/utils/deviceDetection';
import dynamic from 'next/dynamic';

// Dynamically import R3FCanvas to prevent SSR issues
const R3FCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-obsidian">
        <div className="text-white text-sm font-mono">Loading 3D Engine...</div>
      </div>
    ),
  }
);

interface CanvasProps {
  children: ReactNode;
  className?: string;
}

// Define device type to match detectDevice() return
interface DeviceSettings {
  isMobile: boolean;
  isLowPower: boolean;
  isSlowGPU: boolean;
  shouldReduceQuality: boolean;
  recommendedSettings: {
    postProcessing: boolean;
    particleCount: number;
    shadowQuality: 'off' | 'high';
    modelLOD: 'low' | 'high';
    targetFPS: number;
  };
}

function CanvasContent({ children, device }: { children: ReactNode; device: DeviceSettings }) {
  // Dynamically import GhostLoader
  const GhostLoader = dynamic(() => import('./GhostLoader').then(mod => ({ default: mod.GhostLoader })), { ssr: false });
  
  return (
    <Suspense fallback={<GhostLoader />}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow={device.recommendedSettings.shadowQuality !== 'off'} 
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8B5CF6" />
      
      {children}
    </Suspense>
  );
}

export function Canvas({ children, className }: CanvasProps) {
  const [device, setDevice] = useState<DeviceSettings>({
    isMobile: false,
    isLowPower: false,
    isSlowGPU: false,
    shouldReduceQuality: false,
    recommendedSettings: {
      postProcessing: true,
      particleCount: 500,
      shadowQuality: 'high',
      modelLOD: 'high',
      targetFPS: 60,
    },
  });
  
  const [mounted, setMounted] = useState(false);
  
  // Detect device only on client-side after mount
  useEffect(() => {
    setDevice(detectDevice());
    setMounted(true);
  }, []);
  
  // Don't render until mounted to avoid SSR issues
  if (!mounted || typeof window === 'undefined') {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-obsidian">
          <div className="text-white text-sm font-mono">Initializing 3D Engine...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <R3FCanvas
        dpr={device.isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          alpha: true,
          antialias: !device.isMobile,
          powerPreference: device.isMobile ? 'low-power' : 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        shadows={device.recommendedSettings.shadowQuality !== 'off'}
      >
        <CanvasContent device={device}>
          {children}
        </CanvasContent>
      </R3FCanvas>
    </div>
  );
}
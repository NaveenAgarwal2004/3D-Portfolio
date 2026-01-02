'use client';

import { Suspense, ReactNode, useState, useEffect } from 'react';
import { detectDevice } from '@/lib/utils/deviceDetection';

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
  const [R3F, setR3F] = useState<any>(null);
  const [Drei, setDrei] = useState<any>(null);
  
  // Detect device and load R3F only on client-side after mount
  useEffect(() => {
    setDevice(detectDevice());
    
    // Dynamic import of R3F and Drei to prevent SSR issues
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei')
    ]).then(([fiberModule, dreiModule]) => {
      setR3F(fiberModule);
      setDrei(dreiModule);
      setMounted(true);
    }).catch(err => {
      console.error('Failed to load R3F:', err);
    });
  }, []);
  
  // Don't render until mounted and R3F is loaded
  if (!mounted || !R3F || !Drei || typeof window === 'undefined') {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-obsidian">
          <div className="text-white text-sm font-mono">Initializing 3D Engine...</div>
        </div>
      </div>
    );
  }
  
  const { Canvas: R3FCanvas } = R3F;
  const { Html } = Drei;
  
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
        <Suspense fallback={
          <Html center>
            <div className="text-white text-sm font-mono">Loading 3D Scene...</div>
          </Html>
        }>
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
      </R3FCanvas>
    </div>
  );
}
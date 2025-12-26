'use client';

import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { GhostLoader } from './GhostLoader';
import { detectDevice } from '@/lib/utils/deviceDetection';

interface CanvasProps {
  children: ReactNode;
  className?: string;
}

export function Canvas({ children, className }: CanvasProps) {
  const device = detectDevice();
  
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
        shadows={!device.isMobile}
      >
        <Suspense fallback={<GhostLoader />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow={!device.isMobile} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8B5CF6" />
          
          {children}
        </Suspense>
      </R3FCanvas>
    </div>
  );
}
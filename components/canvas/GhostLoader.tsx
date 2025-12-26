'use client';

import { Html } from '@react-three/drei';
import { Spinner } from '@/components/ui/Spinner';

export function GhostLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white text-sm font-mono">Loading 3D Scene...</p>
      </div>
    </Html>
  );
}
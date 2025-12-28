'use client';

import { ReactNode } from 'react';
import { ScrollCamera } from '../controls/ScrollCamera';
import { Effects } from './Effects';

interface SceneProps {
  children: ReactNode;
  enableEffects?: boolean;
}

export function Scene({ children, enableEffects = true }: SceneProps) {
  return (
    <>
      <ScrollCamera />
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 10, 50]} />
      
      {children}
      
      {/* Post-processing effects */}
      {enableEffects && <Effects />}
    </>
  );
}
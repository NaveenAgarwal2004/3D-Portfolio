'use client';

import { ReactNode } from 'react';
import { ScrollCamera } from '../controls/ScrollCamera';

interface SceneProps {
  children: ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <>
      <ScrollCamera />
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 10, 50]} />
      
      {children}
    </>
  );
}
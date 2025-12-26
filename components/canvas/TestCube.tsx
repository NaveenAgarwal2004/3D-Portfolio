'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function TestCube() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Rotate cube
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#4D7FFF" 
        metalness={0.8} 
        roughness={0.2} 
        emissive="#8B5CF6"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

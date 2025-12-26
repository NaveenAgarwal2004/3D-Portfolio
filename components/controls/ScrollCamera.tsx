'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const SCROLL_PHYSICS = {
  momentum: 0.08,      // Responsiveness (0-1)
  damping: 0.9,        // Friction coefficient (0-1)
  maxVelocity: 0.5,    // Maximum speed
  density: 1.5,        // Resistance multiplier
};

export function ScrollCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const velocityRef = useRef(0);
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      // Map scroll progress to camera Y position (0 to -20)
      targetYRef.current = scrollProgress * -20;
    };
    
    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame(() => {
    if (!cameraRef.current) return;
    
    // Calculate velocity from position delta
    const delta = targetYRef.current - currentYRef.current;
    velocityRef.current += delta * SCROLL_PHYSICS.momentum;
    
    // Apply density resistance (aggressive scroll dampening)
    const velocityMagnitude = Math.abs(velocityRef.current);
    if (velocityMagnitude > 0.1) {
      const resistance = Math.pow(velocityMagnitude, SCROLL_PHYSICS.density);
      velocityRef.current *= (1 - resistance * 0.01);
    }
    
    // Clamp velocity to max
    velocityRef.current = THREE.MathUtils.clamp(
      velocityRef.current,
      -SCROLL_PHYSICS.maxVelocity,
      SCROLL_PHYSICS.maxVelocity
    );
    
    // Apply damping (friction)
    velocityRef.current *= SCROLL_PHYSICS.damping;
    
    // Update position
    currentYRef.current += velocityRef.current;
    
    // Apply to camera
    cameraRef.current.position.y = currentYRef.current;
  });
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 10]}
      fov={50}
    />
  );
}
'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { detectDevice } from '@/lib/utils/deviceDetection';

export function Effects() {
  const device = detectDevice();
  
  // Disable post-processing on mobile or low-power devices
  if (device.shouldReduceQuality || !device.recommendedSettings.postProcessing) {
    return null;
  }
  
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom Effect - Makes glowing materials glow */}
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      
      {/* Vignette Effect - Darkens edges */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
      />
    </EffectComposer>
  );
}

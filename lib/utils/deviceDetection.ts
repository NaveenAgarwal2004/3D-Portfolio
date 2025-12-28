export function detectDevice() {
  if (typeof window === 'undefined') return {
    isMobile: false,
    isLowPower: false,
    isSlowGPU: false,
    shouldReduceQuality: false,
    recommendedSettings: {
      postProcessing: true,
      particleCount: 500,
      shadowQuality: 'high' as const,
      modelLOD: 'high' as const,
      targetFPS: 60,
    },
  };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const isLowPower = !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  const isSlowGPU = detectSlowGPU();
  
  return {
    isMobile,
    isLowPower,
    isSlowGPU,
    shouldReduceQuality: isMobile || isLowPower || isSlowGPU,
    recommendedSettings: {
      postProcessing: !isMobile && !isLowPower,
      particleCount: isMobile ? 100 : 500,
      shadowQuality: (isMobile ? 'off' : 'high') as 'off' | 'high',
      modelLOD: (isMobile ? 'low' : 'high') as 'low' | 'high',
      targetFPS: isMobile ? 30 : 60,
    },
  };
}

function detectSlowGPU(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
  
  if (!gl) return true;
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return false;
  
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
  
  // Check for known slow GPUs
  const slowGPUs = [
    'intel',
    'swiftshader',
    'llvmpipe',
    'mali-400',
    'adreno 3',
  ];
  
  return slowGPUs.some(gpu => renderer.toLowerCase().includes(gpu));
}

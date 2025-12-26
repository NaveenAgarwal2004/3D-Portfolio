import type { SanityProject, UnifiedProject } from '../utils/validation';

// === THREE.JS SPECIFIC ===
export interface Model3DConfig {
  url: string;
  fallbackUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  material?: MaterialConfig;
}

export interface MaterialConfig {
  type: 'ceramic' | 'holographic' | 'wireframe' | 'glass';
  metalness?: number;
  roughness?: number;
  transmission?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// === SHADER UNIFORMS ===
export interface GlassRefractionUniforms {
  uTime: number;
  uTransmission: number;
  uThickness: number;
  uIor: number;
  uChromaticAberration: number;
  uDistortionScale: number;
}

export interface HolographicMeshUniforms {
  uTime: number;
  uEmissiveIntensity: number;
  uGlitchAmount: number;
  uFresnelPower: number;
  uColor: string;
}

// === SCROLL PHYSICS ===
export interface ScrollPhysicsConfig {
  momentum: number;
  damping: number;
  maxVelocity: number;
  density: number;
}

// === API RESPONSES ===
export interface UnifiedAPIResponse {
  success: boolean;
  data?: UnifiedProject[];
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    cached: boolean;
    timestamp: string;
  };
}

export interface AICrystalResponse {
  response: string;
  mode: 'cryptic' | 'technical';
  provider: 'gemini' | 'grok';
  context: string[];
  suggestedActions?: string[];
}

export interface AnalyticsPulseEvent {
  type: 'visitor_join' | 'visitor_leave' | 'project_click';
  projectSlug?: string;
  timestamp: string;
}

// === PERFORMANCE MONITORING ===
export interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  memoryUsage: number;
}

import { z } from 'zod';

// === SANITY SCHEMAS ===
export const SanityProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  longDescription: z.string(),
  category: z.enum(['web', 'mobile', '3d', 'ai']),
  techStack: z.array(z.string()),
  
  model3D: z.object({
    cloudinaryUrl: z.string().url(),
    fallbackUrl: z.string().url(),
    position: z.tuple([z.number(), z.number(), z.number()]),
    rotation: z.tuple([z.number(), z.number(), z.number()]),
    scale: z.number(),
  }).optional(),
  
  shaderUniforms: z.object({
    metalness: z.number().min(0).max(1),
    roughness: z.number().min(0).max(1),
    emissiveIntensity: z.number().min(0),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }).optional(),
  
  cameraPosition: z.object({
    position: z.tuple([z.number(), z.number(), z.number()]),
    target: z.tuple([z.number(), z.number(), z.number()]),
    fov: z.number(),
  }).optional(),
  
  publishedAt: z.string().datetime(),
});

export const SanityTechStackSchema = z.object({
  _id: z.string(),
  name: z.string(),
  category: z.enum(['language', 'framework', 'tool', 'service']),
  icon: z.string(),
  color: z.string(),
  constellationPosition: z.tuple([z.number(), z.number(), z.number()]),
  connections: z.array(z.string()),
});

// === API SCHEMAS ===
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  honeypot: z.string().max(0),
});

export const AICrystalQuerySchema = z.object({
  query: z.string().min(1).max(500),
  sessionId: z.string(),
  context: z.array(z.string()).optional(),
});

// === UNIFIED PROJECT TYPE ===
export const UnifiedProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  model3D: SanityProjectSchema.shape.model3D,
  shaderUniforms: SanityProjectSchema.shape.shaderUniforms,
  
  analytics: z.object({
    viewCount: z.number(),
    averageTimeSpent: z.number(),
    lastViewed: z.string().datetime().nullable(),
    engagementScore: z.number(),
  }),
});

// Type inference
export type SanityProject = z.infer<typeof SanityProjectSchema>;
export type SanityTechStack = z.infer<typeof SanityTechStackSchema>;
export type UnifiedProject = z.infer<typeof UnifiedProjectSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type AICrystalQuery = z.infer<typeof AICrystalQuerySchema>;
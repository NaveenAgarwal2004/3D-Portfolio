import { createClient } from '@sanity/client';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('⚠️ SANITY_PROJECT_ID not set. Using mock client.');
}

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mock-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

// Mock data for development
export const MOCK_PROJECTS = [
  {
    _id: '1',
    title: 'Quantum Portfolio',
    slug: 'quantum-portfolio',
    description: 'Immersive 3D developer portfolio with AI assistant',
    longDescription: 'A cutting-edge portfolio showcasing advanced Three.js rendering, real-time analytics, and AI-powered interactions.',
    category: '3d' as const,
    techStack: ['React', 'Three.js', 'TypeScript', 'Next.js', 'Tailwind'],
    publishedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'Modern e-commerce solution with real-time inventory',
    longDescription: 'Full-stack e-commerce platform with Stripe integration, real-time inventory management, and admin dashboard.',
    category: 'web' as const,
    techStack: ['Next.js', 'PostgreSQL', 'Stripe', 'Prisma', 'TailwindCSS'],
    publishedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'AI Content Generator',
    slug: 'ai-content-generator',
    description: 'Multi-modal AI content creation tool',
    longDescription: 'AI-powered content generation platform supporting text, images, and code generation with multiple LLM providers.',
    category: 'ai' as const,
    techStack: ['React', 'OpenAI', 'Anthropic', 'FastAPI', 'MongoDB'],
    publishedAt: new Date().toISOString(),
  },
];

export const MOCK_TECH_STACK = [
  {
    _id: 'tech-1',
    name: 'React',
    category: 'framework' as const,
    icon: '⚛️',
    color: '#61DAFB',
    constellationPosition: [0, 0, 0] as [number, number, number],
    connections: ['tech-2', 'tech-3'],
  },
  {
    _id: 'tech-2',
    name: 'Three.js',
    category: 'framework' as const,
    icon: '🎮',
    color: '#000000',
    constellationPosition: [2, 1, -1] as [number, number, number],
    connections: ['tech-1'],
  },
  {
    _id: 'tech-3',
    name: 'TypeScript',
    category: 'language' as const,
    icon: '📘',
    color: '#3178C6',
    constellationPosition: [-2, 0, 1] as [number, number, number],
    connections: ['tech-1'],
  },
];
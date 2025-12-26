import { z } from 'zod';

// === API REQUEST/RESPONSE SCHEMAS ===
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

// === TYPE INFERENCE ===
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type AICrystalQuery = z.infer<typeof AICrystalQuerySchema>;

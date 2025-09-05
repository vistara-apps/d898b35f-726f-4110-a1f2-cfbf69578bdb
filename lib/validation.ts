import { z } from 'zod';

// User validation schema
export const UserSchema = z.object({
  userId: z.string().uuid(),
  walletAddress: z.string().optional(),
  languagePreference: z.enum(['en', 'es']),
  state: z.string().min(2).max(50),
  createdAt: z.date(),
});

// Recording validation schema
export const InteractionRecordingSchema = z.object({
  recordingId: z.string().uuid(),
  userId: z.string().uuid(),
  timestamp: z.date(),
  duration: z.number().positive(),
  filePath: z.string().url(),
  interactionType: z.enum(['traffic_stop', 'questioning', 'home_search', 'other']),
  location: z.string().optional(),
  aiSummary: z.string().optional(),
  createdAt: z.date(),
});

// Rights card validation schema
export const RightsCardSchema = z.object({
  cardId: z.string().uuid(),
  state: z.string().min(2).max(50),
  interactionType: z.string(),
  title: z.string().min(1).max(200),
  content: z.object({
    dos: z.array(z.string()),
    donts: z.array(z.string()),
    keyRights: z.array(z.string()),
  }),
  script: z.object({
    phrases: z.array(z.string()),
    responses: z.array(z.string()),
  }),
  language: z.enum(['en', 'es']),
});

// API request validation schemas
export const GenerateSummaryRequestSchema = z.object({
  interactionType: z.enum(['traffic_stop', 'questioning', 'home_search', 'other']),
  duration: z.number().positive(),
  location: z.string().optional(),
});

export const GenerateCardRequestSchema = z.object({
  interactionType: z.enum(['traffic_stop', 'questioning', 'home_search', 'other']),
  state: z.string().min(2).max(50),
  context: z.string().optional(),
});

// Settings validation schema
export const SettingsSchema = z.object({
  autoSave: z.boolean(),
  cloudSync: z.boolean(),
  notifications: z.boolean(),
  darkMode: z.boolean(),
});

// Form validation schemas
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export const FeedbackFormSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10).max(500),
  category: z.enum(['bug', 'feature', 'improvement', 'other']),
});

// Validation helper functions
export function validateApiRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function sanitizeAndValidate<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}

// Type exports
export type User = z.infer<typeof UserSchema>;
export type InteractionRecording = z.infer<typeof InteractionRecordingSchema>;
export type RightsCard = z.infer<typeof RightsCardSchema>;
export type GenerateSummaryRequest = z.infer<typeof GenerateSummaryRequestSchema>;
export type GenerateCardRequest = z.infer<typeof GenerateCardRequestSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type ContactForm = z.infer<typeof ContactFormSchema>;
export type FeedbackForm = z.infer<typeof FeedbackFormSchema>;

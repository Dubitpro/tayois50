import { z } from 'zod';

export const messageSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters.").max(50, "Name cannot exceed 50 characters.").trim(),
  country: z.string().min(1, "Country is required.").max(50, "Country cannot exceed 50 characters.").trim(),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message cannot exceed 500 characters.").trim()
});

export type MessageFormData = z.infer<typeof messageSchema>;

export const wishPostSchema = z.object({
  type: z.enum(['text', 'video']),
  fullName: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name cannot exceed 100 characters.").trim(),
  country: z.string().min(1, "Country is required.").max(100, "Country cannot exceed 100 characters.").trim(),
  message: z.string().max(2000, "Message cannot exceed 2000 characters.").optional(),
  caption: z.string().max(500, "Caption cannot exceed 500 characters.").optional(),
}).refine(data => {
  if (data.type === 'text') {
    return !!data.message && data.message.trim().length >= 5;
  }
  return true;
}, {
  message: "Message must be at least 5 characters.",
  path: ['message']
});

export type WishPostFormData = z.infer<typeof wishPostSchema>;

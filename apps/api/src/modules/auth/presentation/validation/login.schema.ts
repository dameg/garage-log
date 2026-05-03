import { z } from 'zod';

export const loginHttpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginHttpBody = z.infer<typeof loginHttpSchema>;

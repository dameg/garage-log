import { z } from 'zod';

export const loginUserHttpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginUserHttpBody = z.infer<typeof loginUserHttpSchema>;

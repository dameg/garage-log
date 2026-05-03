import { z } from 'zod';

export const registerHttpSchema = z.object({
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z.string().min(6),
});

export type RegisterHttpBody = z.infer<typeof registerHttpSchema>;

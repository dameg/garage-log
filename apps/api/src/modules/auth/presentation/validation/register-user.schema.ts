import { z } from 'zod';

export const registerUserHttpSchema = z.object({
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z.string().min(6),
});

export type RegisterUserHttpBody = z.infer<typeof registerUserHttpSchema>;

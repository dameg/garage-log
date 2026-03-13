import z from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = LoginInput;

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type LoginResponse = User;

import { z } from 'zod';

export const CreateUserSchema = z.object({
  role: z.enum(['user', 'admin']),
  userId: z.string(),
  name: z.string().min(1).max(18),
  email: z.string(),
  passwordHash: z.string().min(8),
});

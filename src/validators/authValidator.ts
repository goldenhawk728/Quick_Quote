import { z } from 'zod';

export const RegistrationSchema = z.object({
  email: z.email(),
  // Enforce minimum complexity before hashing
  password: z.string().min(8).max(64),
});

export type RegistrationBody = z.infer<typeof RegistrationSchema>;

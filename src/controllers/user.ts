import { Request, Response } from 'express';
import { uuidv7 } from 'uuidv7';
import { User } from '../entities/user.js';
import { users } from '../models/user';
import { CreateUserSchema } from '../validators/user';

export function createUser(req: Request, res: Response): void {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newUser: User = {
    role: result.data.role,
    userID: uuidv7(),
    name: result.data.name,
    email: result.data.email,
    passwordHash: result.data.passwordHash,
    accountCreationDate: new Date(),
  };

  users.push(newUser);

  res.status(201).json(newUser);
}

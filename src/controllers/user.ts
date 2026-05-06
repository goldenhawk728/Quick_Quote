import argon2 from 'argon2';
import { Request, Response } from 'express';
import { uuidv7 } from 'uuidv7';
import { User } from '../entities/user.js';
import { addUser, getAllUsers, getUserById, users } from '../models/user.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { RegistrationSchema } from '../validators/authValidator.js';
import { CreateUserSchema } from '../validators/user.js';

export function createUser(req: Request, res: Response): void {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  const newUser: User = {
    role: result.data.role,
    userId: result.data.userId,
    name: result.data.name,
    email: result.data.email,
    passwordHash: result.data.passwordHash,
    generateId: function (): void {
      this.userId = uuidv7();
    },
    verifiedEmail: false,
  };

  users.push(newUser);

  res.status(201).json(newUser);
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await getAllUsers();
  res.json({ users });
}

export async function getUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const user = await getUserById(userId as string);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user });
}

export async function registerUser(req: Request, res: Response): Promise<void> {
  const result = RegistrationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, password } = result.data;

  try {
    const passwordHash = await argon2.hash(password);
    const newUser = await addUser(email, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

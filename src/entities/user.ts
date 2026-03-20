export type User = {
  role: string;
  userID: string;
  name: string;
  email: string;
  passwordHash: string;
  accountCreationDate: Date;
};

export type TempJoinCode = {
  code: number;
};

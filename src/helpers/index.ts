import * as bcrypt from 'bcrypt';

export const heshPassword = async (password: string) =>
  bcrypt.hashSync(password, 12);

export * from './responses/paginations';
export * from './getLocationFromIp';

import * as bcrypt from 'bcrypt';

export const heshPassword = async (password: string) =>
  bcrypt.hashSync(password, 12);

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const getRandomInRange = (from, to, fixed) => {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
};

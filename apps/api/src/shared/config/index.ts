import { validateEnv } from './env';

export const env = validateEnv(process.env);

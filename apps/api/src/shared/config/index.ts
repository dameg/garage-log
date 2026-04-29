import { validateEnv } from './env';

import 'dotenv/config';

export const env = validateEnv(process.env);

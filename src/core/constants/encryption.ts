import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT;

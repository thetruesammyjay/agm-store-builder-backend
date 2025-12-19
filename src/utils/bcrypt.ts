import bcrypt from 'bcrypt';
import { config } from '../config/env';

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(config.bcryptRounds);
  return await bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Check if password needs rehashing (rounds changed)
 */
export function needsRehash(hash: string): boolean {
  const rounds = bcrypt.getRounds(hash);
  return rounds !== config.bcryptRounds;
}
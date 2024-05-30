import {genSalt, hash, compare} from 'bcrypt';

const saltRounds = 10;

export async function generate(plainValue: string): Promise<string> {
  const salt = await genSalt(saltRounds);
  return hash(plainValue, salt);
}

export async function validate(
  hashValue: string,
  plainValue: string
): Promise<boolean> {
  return compare(hashValue, plainValue);
}

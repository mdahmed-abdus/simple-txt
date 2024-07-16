import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  randomFillSync,
} from 'node:crypto';

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
const key = scryptSync(password, 'salt', 24);
const iv = randomFillSync(new Uint8Array(16));

export function encrypt(data: string): string {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export function decrypt(data: string): string {
  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

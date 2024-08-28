// the key length is dependent on the algorithm
// in case for aes192, it is 24 bytes (192 bits)
// https://nodejs.org/api/crypto.html
// https://nodejs.org/api/crypto.html#class-cipher
//
// consider using String.prototype.normalize() on user inputs before passing them to cryptographic APIs
// https://nodejs.org/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis

import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';

const ALGORITHM = 'aes-192-cbc';
const SALT_SIZE = 16;
const KEY_LENGTH = 24;

export function encrypt(
  data: string,
  password: string
): { success: boolean; encrypted?: string; iv?: Buffer; message?: string } {
  password = password.normalize('NFC');

  const salt = randomBytes(SALT_SIZE).toString('hex');
  const key = scryptSync(password, salt, KEY_LENGTH);
  const iv = randomBytes(16);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  try {
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    encrypted = salt + '$' + encrypted;
    return { success: true, encrypted, iv };
  } catch (err) {
    return { success: false, message: 'Could not encrypt' };
  }
}

export function decrypt(
  data: string,
  password: string,
  iv: Buffer
): { success: boolean; decrypted?: string; message?: string } {
  password = password.normalize('NFC');

  const x = data.split('$');
  const salt = x[0];
  data = x[1];

  const key = scryptSync(password, salt, KEY_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);

  try {
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return { success: true, decrypted };
  } catch (err) {
    return {
      success: false,
      message: 'Could not decrypt - invalid password possible',
    };
  }
}

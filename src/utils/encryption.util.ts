import { Buffer } from 'buffer';
import { createCipheriv, createDecipheriv } from 'crypto';
import { IMPORT_CONST } from '@constant/import.constant';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = Buffer.from(
  '0f9G9oUpys4afdKq3Szi/eehES3s3wWupCOHFHHqkCg=',
  IMPORT_CONST.DEFAULT_ENCODING.ENCODE,
);
const INIT_VECTOR = Buffer.from(
  'pDbV4OVepSO94hvb8rC3Bg==',
  IMPORT_CONST.DEFAULT_ENCODING.ENCODE,
);

export async function encrypt(input: string) {
  const cipher = createCipheriv(ALGORITHM, SECRET_KEY, INIT_VECTOR);

  return (
    cipher.update(
      input,
      IMPORT_CONST.DEFAULT_ENCODING.TEXT,
      IMPORT_CONST.DEFAULT_ENCODING.ENCODE,
    ) + cipher.final(IMPORT_CONST.DEFAULT_ENCODING.ENCODE)
  );
}

export async function decrypt(encryptedInput) {
  const decipher = createDecipheriv(ALGORITHM, SECRET_KEY, INIT_VECTOR);

  return (
    decipher.update(
      encryptedInput,
      IMPORT_CONST.DEFAULT_ENCODING.ENCODE,
      IMPORT_CONST.DEFAULT_ENCODING.TEXT,
    ) + decipher.final(IMPORT_CONST.DEFAULT_ENCODING.TEXT)
  );
}

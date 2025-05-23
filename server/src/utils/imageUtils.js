import crypto from 'crypto';
import path from 'path';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImage = (file) => {
  if (!file) throw new Error('No file provided');
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 5MB');
  }
};

export const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256')
    .update(originalname + timestamp)
    .digest('hex')
    .substring(0, 16);
  return `${hash}${path.extname(originalname)}`;
};

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolves to the absolute path of the ss-edu-backend folder on disk
export const BACKEND_ROOT = path.resolve(__dirname, '../..');

/**
 * Returns the absolute path to a file inside the public/uploads directory.
 * @param {string} filename Optional filename to append
 * @returns {string} Absolute file path
 */
export const getUploadPath = (filename = '') => {
  return path.join(BACKEND_ROOT, 'public/uploads', filename);
};

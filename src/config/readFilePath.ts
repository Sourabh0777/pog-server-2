import fs from 'fs';
import path from 'path';

export const getAllFilePaths = (dir: string) => {
  const files = fs.readdirSync(dir);
  return files.map(file => path.join(dir, file));
};

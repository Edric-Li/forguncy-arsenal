import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import shelljs from 'shelljs';

const dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  shelljs.exec('vite build');

  const distDir = path.resolve(dirname, '../dist/assets');
  const targetDir = path.resolve(dirname, '../../Resources/dist');
  const files = fs.readdirSync(distDir);

  fs.copySync(
    path.resolve(
      distDir,
      files.find((item) => item.endsWith('.js')),
    ),
    path.resolve(targetDir, 'arsenal.core.js'),
  );
}

main();

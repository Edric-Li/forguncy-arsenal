import * as path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import shelljs from 'shelljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  shelljs.exec('vite build');

  const distDir = path.resolve(__dirname, '../dist/assets');
  const targetDir = path.resolve(__dirname, '../../Resources');
  const files = fs.readdirSync(distDir);

  fs.copySync(path.resolve(distDir, files.find(item => item.endsWith('.js'))), path.resolve(targetDir, 'arsenal.core.js'));
  fs.copySync(path.resolve(distDir, files.find(item => item.endsWith('.css'))), path.resolve(targetDir, 'arsenal.core.css'));
}

main();

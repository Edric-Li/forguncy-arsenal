import * as path from 'path';
import fs from 'fs-extra';
import {fileURLToPath} from 'url';
import shelljs from 'shelljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
    shelljs.exec('vite build');

    const distDir = path.resolve(__dirname, '../dist');
    const targetDir = path.resolve(__dirname, '../../Resources/dist/watermark-editor');

    fs.copySync(distDir, targetDir);
}

main();

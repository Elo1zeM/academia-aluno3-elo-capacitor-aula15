import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const source = join(process.cwd(), 'assets', 'fitzone_alert.wav');
const targetDir = join(process.cwd(), 'android', 'app', 'src', 'main', 'res', 'raw');
if (!existsSync(source)) throw new Error('Arquivo de som não encontrado: ' + source);
mkdirSync(targetDir, { recursive: true });
copyFileSync(source, join(targetDir, 'fitzone_alert.wav'));
console.log('Som FitZone copiado para os recursos nativos do Android.');
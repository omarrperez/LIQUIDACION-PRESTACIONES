import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStandaloneHtml } from '../src/standaloneHtml.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const html = generateStandaloneHtml();

const p1 = path.join(root, 'public/Liquidacion_Prestaciones_LOTTT_Venezuela.html');
const p2 = path.join(root, 'public/Liquidacion_LOTTT.html');

fs.writeFileSync(p1, html, 'utf-8');
fs.writeFileSync(p2, html, 'utf-8');

console.log('Successfully wrote pure standalone HTML to:');
console.log('-', p1, `(${fs.statSync(p1).size} bytes)`);
console.log('-', p2, `(${fs.statSync(p2).size} bytes)`);

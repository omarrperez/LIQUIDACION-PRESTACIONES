import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function buildSingleHtml() {
  console.log('Building standalone single-file HTML bundle...');
  const outDir = path.resolve(root, 'dist-single');
  
  await build({
    root,
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile({ useRecommendedBuildConfig: true, removeViteModuleLoader: true })
    ],
    resolve: {
      alias: {
        '@': root,
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
      target: 'es2020',
      minify: true,
    },
    logLevel: 'info',
  });

  const generatedHtmlPath = path.join(outDir, 'index.html');
  if (fs.existsSync(generatedHtmlPath)) {
    const targetPublicPath = path.resolve(root, 'public/Liquidacion_Prestaciones_LOTTT_Venezuela.html');
    const content = fs.readFileSync(generatedHtmlPath, 'utf-8');
    fs.writeFileSync(targetPublicPath, content, 'utf-8');
    const stats = fs.statSync(targetPublicPath);
    console.log(`Success! Standalone single-file HTML created at ${targetPublicPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    throw new Error('index.html was not generated in dist-single');
  }
}

buildSingleHtml().catch((err) => {
  console.error('Build single HTML failed:', err);
  process.exit(1);
});

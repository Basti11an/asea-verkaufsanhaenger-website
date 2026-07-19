const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distIndexPath = path.join(distDir, 'index.html');
const rootStartPath = path.join(rootDir, 'START_WEBSITE.html');
const distStartPath = path.join(distDir, 'START_WEBSITE.html');

const mimeByExtension = {
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function toDataUri(assetPath) {
  const extension = path.extname(assetPath).toLowerCase();
  const mime = mimeByExtension[extension];
  if (!mime || !fs.existsSync(assetPath)) {
    return null;
  }

  const base64 = fs.readFileSync(assetPath).toString('base64');
  return `data:${mime};base64,${base64}`;
}

function escapeClosingTags(content, tagName) {
  return content.replace(new RegExp(`</${tagName}`, 'gi'), `<\\/${tagName}`);
}

const html = readRequired(distIndexPath);
const scriptMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not find the Vite JS/CSS assets in dist/index.html.');
}

const jsPath = path.join(distDir, scriptMatch[1]);
const cssPath = path.join(distDir, styleMatch[1]);
const jsDir = path.dirname(jsPath);

let js = readRequired(jsPath);
const css = readRequired(cssPath);

js = js.replace(/new URL\("([^"]+)",import\.meta\.url\)\.href/g, (match, filename) => {
  const dataUri = toDataUri(path.join(jsDir, filename));
  return dataUri ? JSON.stringify(dataUri) : match;
});

const singleFileHtml = html
  .replace(styleMatch[0], () => `<style>\n${escapeClosingTags(css, 'style')}\n</style>`)
  .replace(scriptMatch[0], () => `<script type="module">\n${escapeClosingTags(js, 'script')}\n</script>`);

fs.writeFileSync(rootStartPath, singleFileHtml, 'utf8');
fs.writeFileSync(distStartPath, singleFileHtml, 'utf8');

console.log(`Created ${path.relative(rootDir, rootStartPath)}`);
console.log(`Created ${path.relative(rootDir, distStartPath)}`);

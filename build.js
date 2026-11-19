/**
 * PROJECT BARANG TEMUAN — BUILD SCRIPT
 * Memvalidasi berkas, memeriksa sintaksis JS, dan menyiapkan folder distribusi publik (`public/` & `dist/`)
 * Mendukung parameter `--output <dir>` sesuai spesifikasi build framework
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==============================================');
console.log('🚀 Memulai proses build Project Barang Temuan...');
console.log('==============================================\n');

const rootDir = __dirname;

// 1. Parsing argumen output (--output <dir> / -o <dir> / --output=<dir>)
let outputDirName = 'public'; // Default output: public
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' || args[i] === '-o') {
    if (args[i + 1]) {
      outputDirName = args[i + 1];
      i++;
    }
  } else if (args[i].startsWith('--output=')) {
    outputDirName = args[i].split('=')[1];
  }
}

// Target folder yang akan disiapkan (selalu sinkronkan public dan dist)
const targetDirs = [path.join(rootDir, outputDirName)];
if (outputDirName !== 'dist') {
  targetDirs.push(path.join(rootDir, 'dist'));
}
if (outputDirName !== 'public') {
  targetDirs.push(path.join(rootDir, 'public'));
}

// 2. Validasi Sintaksis Seluruh File JavaScript
console.log('📦 [1/3] Memeriksa sintaksis JavaScript di folder js/...');
const jsDir = path.join(rootDir, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  jsFiles.forEach(file => {
    const fullPath = path.join(jsDir, file);
    try {
      execSync(`node -c "${fullPath}"`);
      console.log(`  ✓ ${file} [OK]`);
    } catch (err) {
      console.error(`  ✗ ${file} [ERROR]:`, err.message);
      process.exit(1);
    }
  });
} else {
  console.warn('  ! Folder js/ tidak ditemukan');
}

// 3. Salin Berkas ke Folder Output
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

targetDirs.forEach(destDir => {
  const relDest = path.relative(rootDir, destDir);
  console.log(`\n📁 [2/3] Menyiapkan output build di folder ${relDest}/...`);
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  console.log(`  Menyalin ${htmlFiles.length} halaman HTML...`);
  htmlFiles.forEach(htmlFile => {
    fs.copyFileSync(path.join(rootDir, htmlFile), path.join(destDir, htmlFile));
  });

  ['css', 'js', 'assets'].forEach(dirName => {
    const src = path.join(rootDir, dirName);
    const dest = path.join(destDir, dirName);
    if (fs.existsSync(src)) {
      console.log(`  Menyalin folder ${dirName}/...`);
      copyRecursive(src, dest);
    }
  });
});

// 4. Selesai
console.log('\n✨ [3/3] Verifikasi berkas build:');
console.log(`  Total berkas HTML : ${htmlFiles.length}`);
targetDirs.forEach(d => {
  console.log(`  Output direktori  : ${d}`);
});
console.log('\n==============================================');
console.log('✅ BUILD BERHASIL (Build Succeeded)!');
console.log('==============================================');

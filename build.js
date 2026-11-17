/**
 * PROJECT BARANG TEMUAN — BUILD SCRIPT
 * Memvalidasi berkas, memeriksa sintaksis JS, dan menyiapkan folder distribusi `dist/`
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==============================================');
console.log('🚀 Memulai proses build Project Barang Temuan...');
console.log('==============================================\n');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

// 1. Validasi Sintaksis Seluruh File JavaScript
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

// 2. Siapkan Folder Dist
console.log('\n📁 [2/3] Menyiapkan output build di folder dist/...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

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

// Salin semua file HTML
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
console.log(`  Menyalin ${htmlFiles.length} halaman HTML...`);
htmlFiles.forEach(htmlFile => {
  fs.copyFileSync(path.join(rootDir, htmlFile), path.join(distDir, htmlFile));
});

// Salin folder css, js, assets jika ada
['css', 'js', 'assets'].forEach(dirName => {
  const src = path.join(rootDir, dirName);
  const dest = path.join(distDir, dirName);
  if (fs.existsSync(src)) {
    console.log(`  Menyalin folder ${dirName}/...`);
    copyRecursive(src, dest);
  }
});

// 3. Selesai
console.log('\n✨ [3/3] Verifikasi berkas build:');
console.log(`  Total berkas HTML : ${htmlFiles.length}`);
console.log(`  Output direktori  : ${distDir}`);
console.log('\n==============================================');
console.log('✅ BUILD BERHASIL (Build Succeeded)!');
console.log('==============================================');

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const targetDir = process.cwd();

const folders = ['.bmad', '.claude'];

console.log('🚀 Installing BMAD workflows and Claude commands...\n');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

folders.forEach(folder => {
  const source = path.join(sourceDir, folder);
  const target = path.join(targetDir, folder);

  if (fs.existsSync(target)) {
    console.log(`⚠️  ${folder} already exists, skipping...`);
  } else {
    console.log(`📁 Copying ${folder}...`);
    copyRecursiveSync(source, target);
    console.log(`✅ ${folder} installed successfully!`);
  }
});

console.log('\n✨ Installation complete!');
console.log('\nYou can now use BMAD workflows with Claude Code:');
console.log('  - /bmad:bmm:workflows:*');
console.log('  - /bmad:cis:workflows:*');
console.log('  - /bmad:core:workflows:*');

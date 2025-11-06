const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/html/oasman');
const destDir = path.join(__dirname, '../out/oasman');

// Function to copy directory recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // Ensure destination directory exists
    const destParent = path.dirname(dest);
    if (!fs.existsSync(destParent)) {
      fs.mkdirSync(destParent, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying oasman files from public/html/oasman to out/oasman...');

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

try {
  copyRecursiveSync(sourceDir, destDir);
  console.log('Successfully copied oasman files!');
} catch (error) {
  console.error('Error copying files:', error);
  process.exit(1);
}


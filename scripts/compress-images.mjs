import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const shelvesDir = path.resolve('public/shelves');

async function compressImages() {
  const shelfDirs = fs.readdirSync(shelvesDir).filter(d =>
    fs.statSync(path.join(shelvesDir, d)).isDirectory()
  );

  let totalOriginal = 0;
  let totalCompressed = 0;
  let count = 0;

  for (const dir of shelfDirs) {
    const dirPath = path.join(shelvesDir, dir);
    const pngs = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));

    for (const png of pngs) {
      const inputPath = path.join(dirPath, png);
      const outputPath = path.join(dirPath, png.replace('.png', '.webp'));

      const originalSize = fs.statSync(inputPath).size;
      totalOriginal += originalSize;

      try {
        await sharp(inputPath)
          .webp({ quality: 75 })
          .toFile(outputPath);

        const compressedSize = fs.statSync(outputPath).size;
        totalCompressed += compressedSize;
        count++;

        const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        console.log(`✓ ${dir}/${png} → .webp | ${(originalSize / 1e6).toFixed(1)}MB → ${(compressedSize / 1e6).toFixed(1)}MB (${savings}% smaller)`);
      } catch (err) {
        console.error(`✗ Failed: ${dir}/${png} — ${err.message}`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Compressed ${count} images`);
  console.log(`Total: ${(totalOriginal / 1e6).toFixed(1)}MB → ${(totalCompressed / 1e6).toFixed(1)}MB`);
  console.log(`Savings: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
}

compressImages();

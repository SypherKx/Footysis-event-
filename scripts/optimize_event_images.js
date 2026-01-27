const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = path.resolve('src/media/events');
// Ensure files are read from the correct directory
if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    process.exit(1);
}

const files = fs.readdirSync(directory);

files.forEach(async (file) => {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(directory, file);
        // Create a temporary output path
        const outputPath = path.join(directory, `optimized-${file}`);

        try {
            const metadata = await sharp(inputPath).metadata();
            console.log(`Processing ${file} (Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB)`);

            await sharp(inputPath)
                .resize({ width: 1200, withoutEnlargement: true }) // Resize if huge, but these seem ok. limiting width is good practice.
                .jpeg({ quality: 60, mozjpeg: true }) // Aggressive compression
                .toFile(outputPath);

            const originalSize = fs.statSync(inputPath).size;
            const newSize = fs.statSync(outputPath).size;

            console.log(`Saved ${file} -> ${(newSize / 1024).toFixed(2)} KB (Reduced by ${((1 - newSize / originalSize) * 100).toFixed(1)}%)`);

            // Replace original with optimized
            fs.unlinkSync(inputPath);
            fs.renameSync(outputPath, inputPath);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
});

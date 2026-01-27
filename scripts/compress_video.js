const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

console.log('Setting ffmpeg path to:', ffmpegPath);
ffmpeg.setFfmpegPath(ffmpegPath);

const inputFile = path.resolve('src/media/new-background.mp4');
const outputFile = path.resolve('src/media/new-background-compressed.mp4');

console.log(`Compressing ${inputFile} to ${outputFile}...`);

ffmpeg(inputFile)
    .videoCodec('libx264')
    .outputOptions([
        '-crf 28',         // Higher CRF = higher compression (lower quality). 28 should limit size significantly.
        '-preset veryslow', // Better compression for same quality but slower
        '-an'              // Remove audio (as requested earlier)
    ])
    .on('end', () => {
        console.log('Compression finished successfully!');
    })
    .on('error', (err) => {
        console.error('Error occurred: ' + err.message);
        process.exit(1);
    })
    .save(outputFile);

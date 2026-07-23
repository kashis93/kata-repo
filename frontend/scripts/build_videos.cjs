const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function makeCarVideo(make, model, outputName) {
  const angles = ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31'];
  const tmpDir = path.join('/tmp', `png_${outputName}`);
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`Fetching PNG frames for ${make} ${model}...`);
  for (let i = 0; i < angles.length; i++) {
    const ang = angles[i];
    const url = `https://cdn.imagin.studio/getimage?customer=hrfwsdesigncode&make=${make}&modelFamily=${model}&angle=${ang}&width=1200`;
    const framePath = path.join(tmpDir, `frame_${String(i).padStart(2, '0')}.png`);
    await download(url, framePath);
  }

  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${outputName}.mp4`);

  const ffmpegCmd = `ffmpeg -y -framerate 10 -i "${tmpDir}/frame_%02d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1200:750:force_original_aspect_ratio=decrease,pad=1200:750:(1200-iw)/2:(750-ih)/2:color=0xFAF7F2" "${outPath}"`;
  console.log(`Compiling video: ${outputName}...`);
  execSync(ffmpegCmd);
  console.log(`Successfully generated ${outPath}`);
}

async function run() {
  await makeCarVideo('mercedes-benz', 'eqc', 'hero-car-eqc');
  await makeCarVideo('porsche', 'taycan', 'porsche-taycan');
  await makeCarVideo('audi', 'e-tron-gt', 'audi-etron');
  await makeCarVideo('bmw', 'i7', 'bmw-i7');
}

run().catch((err) => {
  console.error('Error generating videos:', err);
  process.exit(1);
});

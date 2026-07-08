const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop',
    dest: 'client/src/assets/public/hero/hero-students.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1524069290683-0457ab88144b?q=80&w=2069&auto=format&fit=crop',
    dest: 'client/src/assets/public/hero/mission-community.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2064&auto=format&fit=crop',
    dest: 'client/src/assets/public/stories/student-success.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1593113589914-075568e0916e?q=80&w=2069&auto=format&fit=crop',
    dest: 'client/src/assets/public/stories/volunteer-action.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1603957263590-449e0c51fbd0?q=80&w=2070&auto=format&fit=crop',
    dest: 'client/src/assets/public/stories/community-impact.jpg'
  }
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  for (const img of images) {
    console.log(`Downloading ${img.dest}...`);
    try {
      await download(img.url, path.resolve(__dirname, img.dest));
      console.log(`Success: ${img.dest}`);
    } catch (err) {
      console.error(`Failed to download ${img.dest}:`, err.message);
    }
  }
}

main();

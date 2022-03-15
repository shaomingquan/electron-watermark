const path = require('path');

const rootPath = path.join(__dirname, '../..');
const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');

const ffmpegStatic = require('ffmpeg-static')

const { exec } = require('child_process')

exec(`cp ${ffmpegStatic} ${distMainPath}`)
exec(`cp ${path.join(rootPath, 'src/main/utils/simhei.ttf')} ${distMainPath}`)
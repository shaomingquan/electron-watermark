import _ from 'lodash';

const { exec, execSync } = require('child_process');
const pathToFfmpeg = require('ffmpeg-static');
const path = require('path');
const { app } = require('electron');

const fontFile = path.resolve(__dirname, './simhei.ttf');
const makeDrawtext = (i) => {
  return `drawtext=fontfile=${fontFile}: text='禁止搬运':x=${0}:y=${
    i * 220
  }:fontsize=180:fontcolor=white:alpha=0.5`;
};
const drawtext = [
  makeDrawtext(0),
  makeDrawtext(1),
  makeDrawtext(2),
  makeDrawtext(3),
  makeDrawtext(4),
  makeDrawtext(5),
].join(',');

const getFileName = (file) => file.split('/').reverse()[0];
const makeCmd = (file, distDir) => {
  const src = file;
  const dist = path.join(distDir, getFileName(file));
  return `${pathToFfmpeg} -i "${src}" -vf "${drawtext}" "${dist}"`;
};

export const getTaskDir = (task) => {
  const taskId = task?.taskId;
  return path.resolve(app.getPath('userData'), './jinzhibanyun', `./${taskId}`);
};

export const genTask = (task) => {
  const files = task?.files || [];
  const taskId = task?.taskId;
  if (!taskId) {
    throw new Error('无taskId');
  }
  if (!files.length) {
    throw new Error('无taskId');
  }
  const distDir = getTaskDir(task);
  const mkdirCmd = `mkdir -p "${distDir}"`;
  console.log(execSync(mkdirCmd).toString());

  process.nextTick(() => {
    const groupedFiles = _.chunk(files, 4);
    (async () => {
      for (const group of groupedFiles) {
        const start = Date.now();
        await Promise.all(
          group.map((item) => {
            const cmd = makeCmd(item.file, distDir);
            item.state = 'processing';
            updateTask();

            return new Promise((res) => {
              exec(cmd, (err) => {
                if (err) {
                  item.state = 'error';
                  item.errMsg = err.message;
                  updateTask();
                  res(false);
                } else {
                  item.state = 'done';
                  updateTask();
                  res(true);
                }
              });
            });
          })
        );
      }
    })();
  });

  function updateTask() {
    if (_.some(files, (file) => file.state === 'processing')) {
      task.state = 'processing';
    }
    if (
      _.every(files, (file) => file.state === 'done' || file.state === 'error')
    ) {
      task.state = 'done';
    }
  }

  return task;
};

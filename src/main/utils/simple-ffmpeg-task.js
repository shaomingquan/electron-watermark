import _ from 'lodash';
import { from, map, mergeAll, defer } from 'rxjs';

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
  execSync(mkdirCmd);

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

  process.nextTick(() => {
    const hOObservables = from(files).pipe(
      map((item) => {
        return defer(() => {
          return new Promise((resolve, reject) => {
            const cmd = makeCmd(item.file, distDir);
            item.state = 'processing';
            updateTask();
            exec(cmd, (err) => {
              if (err) {
                item.state = 'error';
                item.errMsg = err.message;
                updateTask();
                resolve(false);
              } else {
                item.state = 'done';
                updateTask();
                resolve(true);
              }
            });
          });
        });
      })
    );

    hOObservables.pipe(mergeAll(4)).subscribe(() => {});
  });

  return task;
};

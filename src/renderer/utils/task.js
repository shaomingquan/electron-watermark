import { v4 as uuidv4 } from 'uuid';

export const genInitialTaskByFiles = (files) => {
  const ts = Date.now();
  return {
    taskId: `task-${new Date().toLocaleString().split('/').join('-')}`,
    createTime: ts,

    state: 'waiting',
    errorMsg: '',
    files: files.map((file) => {
      return {
        state: 'waiting',
        file,
        errorMsg: '',
      };
    }),
  };
};

const fileStateCnMap = {
  waiting: '待开始',
  waiting_process: '待处理',
  processing: '处理中',
  done: '已完成',
  error: '出错',
};
export const getFileStateCn = (state) => {
  return fileStateCnMap[state] || '未知';
};

const fileStateColorMap = {
  processing: 'blue',
  done: 'green',
  error: 'red',
};
export const getFileStateColor = (state) => {
  return fileStateCnMap[state] || '#999';
};

import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ipc, isSuccessIpc } from './utils/ipc'
import { Button, Box, Text } from 'react-desktop/macOs';
import { Gap } from './components/common/gap';
import { genInitialTaskByFiles, getFileStateCn, getFileStateColor } from './utils/task';

const WAITING = 1
const PROCESSING = 2
const DONE = 3
const ERROR = 3

const Hello = () => {

  const [ state, setState ] = useState(WAITING)
  const [ task, setTask ] = useState(null)
  const selectFiles = () => {
    ipc('/select-and-get-files').then(async ret => {
      if (task?.state === 'done' || !task) {
        const released = await ipc('/task/release')
        if (released.data !== true) {
          return false
        }
      }

      setState(WAITING)
      if (isSuccessIpc(ret)) {
        if (!ret.cancel) {
          setTask(genInitialTaskByFiles(ret.data))
        }
      } else {
        alert('出错了！')
      }
    })
  }

  const startTask = () => {
    ipc('/task/start', task).then(ret => {
      if (isSuccessIpc(ret)) {
        setState(PROCESSING)
      } else {
        alert('出错了！')
      }
    })
  }

  const openTaskDir = () => {
    ipc('/task/opendir', task).then(ret => {
      if (!isSuccessIpc(ret)) {
        alert('出错了！')
      }
    })
  }


  useEffect(() => {
    if (state !== PROCESSING || !task ) {
      return
    }
    // 轮询状态
    ipc('/task/refresh', task).then(ret => {
      if (isSuccessIpc(ret)) {
        setTimeout(() => {
          const nextTask = ret.data
          if (nextTask.state === 'processing') {
            setState(PROCESSING)
          } else if (nextTask.state === 'done') {
            setState(DONE)
          }
          setTask(ret.data)
        }, 1000)
      } else {
        setTimeout(() => {
          setTask({...task})
        }, 1000)
      }
    })
  }, [task, state]) 

  let text = ''
  const files = task?.files || []
  if (state === WAITING) {
    text = '请选择文件'
    if (files.length > 0) {
      text = '开始任务，或重新选择文件。已选择' + files.length + '个文件'
    }
  } else if (state === PROCESSING) {
    text = '任务执行中，请耐心等待'
  } else if (state === DONE) {
    text = '任务执行完成～'
  }
  
  return <div>
    <Box padding="10px 10px">
        <Text color='blue'>{text}</Text>
    </Box>
    <Gap />
    <div>
      {(state === WAITING || state === DONE) && <>
        <Button color="blue" onClick={selectFiles}>
            选择文件
        </Button>&nbsp;
      </>}
      {(state === WAITING || state === DONE) && 
        task?.state !== 'done' && 
        files.length > 0 &&
        <>
          <Button color="blue" onClick={startTask}>
              开始任务
          </Button>&nbsp;
        </>}
      {(state === PROCESSING || state === DONE) && !!task?.taskId && <>
        <Button color="blue" onClick={openTaskDir}>
            已生成文件（{files.filter(f => f.state === 'done').length}/{files.length}）
        </Button>
      </>}
    </div>
    <Gap />
    {files.length > 0 && <div className='files'>
        {files.map(item => {
          return <div className='file'>
            <span 
              style={{color: getFileStateColor(item.state)}} 
              className={'file-states ' + item.state}>
              [ {getFileStateCn(item.state)} ]
            </span>
            &nbsp;{item.file} {item.errMsg}
          </div>
        })}
        </div>
      )}
  </div>
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

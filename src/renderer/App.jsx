import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { ipc } from './utils/ipc'

// const { ipcRenderer } = window.require("electron");

const Hello = () => {
  const [text, setText] = useState('');
  useEffect(() => {
    ipc('/clipboard/get').then((ret) => {
      setText(ret);
    })

    ipc('/select-and-get-files').then(ret => {
      console.log('select-and-get-files: ', ret)
    })
    // window.electron.ipcRenderer.once('ipc-example', (arg: string) => {
    //   console.log('~' + arg);
    // });

    // window.electron.ipcRenderer.myPing()
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate {text}</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚{__dirname}
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
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

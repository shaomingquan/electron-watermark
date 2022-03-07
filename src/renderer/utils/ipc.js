
export const ipc = (url, args) => {
    return window.electron.ipcRenderer.invoke('ipc-invoke', { url, args })
};

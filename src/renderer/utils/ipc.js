
export const ipc = (url, args) => {
    return window.electron.ipcRenderer.invoke('ipc-invoke', { url, args })
};

export const isSuccessIpc = ret => {
    return +ret?.code === 0
}
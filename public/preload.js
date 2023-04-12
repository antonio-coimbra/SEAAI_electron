const { channels } = require("../src/shared/constants");
const { contextBridge, ipcRenderer } = require("electron");

const API = {
    getIP: (input) => ipcRenderer.invoke("get-ip", input),
    getAppState: (setAppState) =>
        ipcRenderer.on(channels.APP_STATE, (event, appState) => {
            setAppState(appState);
        }),
    frame: {
        minimize: () => ipcRenderer.send(channels.MINIMIZE),
        maximize: () => ipcRenderer.send(channels.MAXIMIZE),
        close: () => ipcRenderer.send(channels.CLOSE),
        setFullScreen: () => ipcRenderer.send(channels.SET_FULLSCREEN),
    },
};

contextBridge.exposeInMainWorld("api", API);

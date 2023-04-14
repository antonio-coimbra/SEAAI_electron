const { channels } = require("../src/shared/constants");
const { contextBridge, ipcRenderer } = require("electron");

const API = {
    sendIP: (input) => ipcRenderer.invoke(channels.SEND_IP, input),
    autoConnection: () => ipcRenderer.invoke(channels.AUTO_CONNECT),
    frame: {
        minimize: () => ipcRenderer.invoke(channels.MINIMIZE),
        maximize: () => ipcRenderer.invoke(channels.MAXIMIZE),
        close: () => ipcRenderer.invoke(channels.CLOSE),
        setFullScreen: () => ipcRenderer.invoke(channels.SET_FULLSCREEN),
    },

    getAppState: (setAppState) =>
        ipcRenderer.on(channels.APP_STATE, (event, appState) => {
            setAppState(appState);
        }),
};

contextBridge.exposeInMainWorld("api", API);

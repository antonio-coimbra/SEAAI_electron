const { channels } = require("../src/shared/constants");
const { contextBridge, ipcRenderer } = require("electron");
const { isMac } = require("./helpers/detectPlatform");
const { getLastIP } = require("./helpers/storage");

const API = {
    sendIP: (input) => ipcRenderer.invoke(channels.SEND_IP, input),
    autoConnection: () => ipcRenderer.invoke(channels.AUTO_CONNECT),
    cancelAutoConnection: () =>
        ipcRenderer.invoke(channels.CANCEL_AUTO_CONNECT),
    frame: {
        minimize: () => ipcRenderer.invoke(channels.MINIMIZE),
        maximize: () => {
            ipcRenderer.invoke(channels.MAXIMIZE);
        },
        restore: () => {
            ipcRenderer.invoke(channels.MAXIMIZE);
        },
        close: () => ipcRenderer.invoke(channels.CLOSE),
        setFullScreen: () => ipcRenderer.invoke(channels.SET_FULLSCREEN),
    },

    getAppState: (setAppState) =>
        ipcRenderer.on(channels.APP_STATE, (event, appState) => {
            // Set the app state to the renderer process
            setAppState(appState);
            // Send the app state to the main process
            ipcRenderer.send(channels.ELECTRON_APP_STATE, appState);
        }),
    getIsMaximized: (setIsMaximized) =>
        ipcRenderer.on(channels.MAXRES, (event, isMaximized) => {
            setIsMaximized(isMaximized);
        }),
    getOpSystem: (setIsMacOS) => {
        setIsMacOS(isMac);
    },

    getLastIP: (setLastIP) => {
        console.log(`last IP: ${getLastIP()}`);
        setLastIP(getLastIP());
    },
};

contextBridge.exposeInMainWorld("api", API);

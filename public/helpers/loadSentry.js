const { ipcMain } = require("electron");
const {
    getMainWindow,
    getAppBrowserView,
    setViewBounds,
    BROWSER_VIEW_INIT,
} = require("./appStart");
const { channels, appStates } = require("../../src/shared/constants");
const {
    getWindowSavedBounds,
    getWasMaximized,
    saveLastIP,
} = require("./settings");

appIsConnected = false;

function onSuccess(SUCCESS) {
    const bounds = getWindowSavedBounds();
    const mainWindow = getMainWindow();
    if (SUCCESS && !appIsConnected) {
        // If the IP address is valid, render only the TitleBar component
        mainWindow.webContents.send(channels.APP_STATE, appStates.CONNECTED);
        mainWindow.setContentSize(bounds[0], bounds[1]);
        mainWindow.setMinimumSize(470, 495);
        mainWindow.center();
        mainWindow.focus();
        setViewBounds(BROWSER_VIEW_INIT);

        if (getWasMaximized) mainWindow.maximize();
        return SUCCESS;
    } else return false;
}

function loadSentry(ipaddress) {
    // The SUCCESS variable is needed because even when the app fails to load,
    // the "did-finish-load" event is emmited eventually
    let loadedSentry = true;

    const mainWindow = getMainWindow();
    const appBrowserView = getAppBrowserView();

    appBrowserView.webContents.once("did-finish-load", () => {
        console.log("borwserView: did-finish-load");
        saveLastIP(ipaddress);
        return onSuccess(loadedSentry);
    });

    appBrowserView.webContents.on("did-fail-load", () => {
        loadedSentry = false;
        console.log("BrowserView: did-fail-load");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        return loadedSentry;
    });

    appBrowserView.webContents.on("unresponsive", () => {
        loadedSentry = false;
        console.log("BrowserView: unresponsive");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        return loadedSentry;
    });

    const url = `http://${ipaddress}/?${Date.now()}`;
    appBrowserView.webContents.loadURL(url);
    // mainWindow.webContents.loadURL(url); // appears to be usefull because it shows more info in the dev tools
}

ipcMain.on(channels.ELECTRON_APP_STATE, (event, currentState) => {
    appIsConnected = currentState === appStates.CONNECTED ? true : false;
    console.log("appIsConnected in LoadSentry: ", appIsConnected);
});

module.exports = { loadSentry };

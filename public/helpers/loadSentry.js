const { ipcMain } = require("electron");
const {
    getMainWindow,
    getAppBrowserView,
    setViewBounds,
} = require("./appStart");
const {
    channels,
    appStates,
    BROWSER_VIEW_INIT,
} = require("../../src/shared/constants");
const {
    getWindowSavedBounds,
    getWasMaximized,
    saveLastIP,
} = require("./storage");

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

        if (getWasMaximized()) mainWindow.maximize();
        return SUCCESS;
    } else return false;
}

function onError(zeroconf, option) {
    if (option === "last-ip") zeroconf(0);
    return null;
}

async function loadSentry(ipaddress, zeroconf, option) {
    console.log("LOADING SENTRY: " + ipaddress + " -> option: " + option);

    // The loadedSentry variable is needed because even when the app fails to load,
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
        return onError(zeroconf, option);
    });

    appBrowserView.webContents.on("unresponsive", () => {
        loadedSentry = false;
        console.log("BrowserView: unresponsive");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        return onError(zeroconf, option);
    });

    const url = `http://${ipaddress}/?${Date.now()}`;
    await appBrowserView.webContents.loadURL(url);
    // await mainWindow.webContents.loadURL(url); // appears to be usefull because it shows more info in the dev tools
}

ipcMain.on(channels.ELECTRON_APP_STATE, (event, currentState) => {
    appIsConnected = currentState === appStates.CONNECTED ? true : false;
});

module.exports = { loadSentry };

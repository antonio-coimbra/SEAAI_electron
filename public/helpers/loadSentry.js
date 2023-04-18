const {
    getMainWindow,
    getAppBrowserView,
    setViewBounds,
    BROWSER_VIEW_INIT,
} = require("./appStart");
const { channels, appStates } = require("../../src/shared/constants");

function onSuccess(SUCCESS) {
    const mainWindow = getMainWindow();
    if (SUCCESS) {
        // If the IP address is valid, render only the TitleBar component
        mainWindow.webContents.send(channels.APP_STATE, appStates.CONNECTED);
        mainWindow.setContentSize(1800, 850);
        mainWindow.center();
        setViewBounds(BROWSER_VIEW_INIT);
        return SUCCESS;
    } else return !SUCCESS;
}

function recursiveLoadSentry(ipaddress, i, response, recursive) {
    if (ipaddress === null || ipaddress === undefined) {
    }
    // The SUCCESS variable is needed because even when the app fails to load,
    // the "did-finish-load" event is emmited eventually
    let SUCCESS = true;
    const appBrowserView = getAppBrowserView();

    console.log(`automatic loading ip:${response.answers[i].data}`);

    // if (i === 0 || i === 1) return recursive(response, i + 1);

    appBrowserView.webContents.once("did-finish-load", () => {
        console.log("borwserView: did-finish-load");
        return onSuccess(SUCCESS);
    });

    appBrowserView.webContents.on("did-fail-load", () => {
        SUCCESS = false;
        console.log("BrowserView: did-fail-load");
        return recursive(response, i + 1);
    });

    appBrowserView.webContents.on("unresponsive", () => {
        SUCCESS = false;
        console.log("BrowserView: unresponsive");
        return recursive(response, i + 1);
    });

    const url = `http://${ipaddress}/?${Date.now()}`;
    appBrowserView.webContents.loadURL(url);
    // mainWindow.webContents.loadURL(url); // appears to be usefull because it shows more info in the dev tools
}

function simpleLoadSentry(ipaddress) {
    // The SUCCESS variable is needed because even when the app fails to load,
    // the "did-finish-load" event is emmited eventually
    let SUCCESS = true;

    const mainWindow = getMainWindow();
    const appBrowserView = getAppBrowserView();

    appBrowserView.webContents.once("did-finish-load", () => {
        console.log("borwserView: did-finish-load");
        return onSuccess(SUCCESS);
    });

    appBrowserView.webContents.on("did-fail-load", () => {
        SUCCESS = false;
        console.log("BrowserView: did-fail-load");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        return SUCCESS;
    });

    appBrowserView.webContents.on("unresponsive", () => {
        SUCCESS = false;
        console.log("BrowserView: unresponsive");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        return SUCCESS;
    });

    const url = `http://${ipaddress}/?${Date.now()}`;
    appBrowserView.webContents.loadURL(url);
    // mainWindow.webContents.loadURL(url); // appears to be usefull because it shows more info in the dev tools
}

module.exports = { recursiveLoadSentry, simpleLoadSentry };

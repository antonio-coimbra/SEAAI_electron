const {
    getMainWindow,
    getAppBrowserView,
    setViewBounds,
    BROWSER_VIEW_INIT,
} = require("./appStart");
const { channels } = require("../../src/shared/constants");

function loadSentry(ipaddress) {
    // The SUCCESS variable is needed because even when the app fails to load,
    // the "did-finish-load" event is emmited eventually
    let SUCCESS = true;

    const mainWindow = getMainWindow();
    const appBrowserView = getAppBrowserView();

    appBrowserView.webContents.once("did-finish-load", () => {
        console.log("borwserView: did-finish-load");
        if (SUCCESS) {
            // If the IP address is valid, render only the TitleBar component
            mainWindow.webContents.send(channels.APP_STATE, "normal-view");
            mainWindow.maximize();
            setViewBounds(BROWSER_VIEW_INIT);
        }
        mainWindow.show();
        return;
    });

    appBrowserView.webContents.on("did-fail-load", () => {
        SUCCESS = false;
        console.log("BrowserView: did-fail-load");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        mainWindow.removeBrowserView(appBrowserView);
        mainWindow.show();
        return;
    });

    appBrowserView.webContents.on("unresponsive", () => {
        SUCCESS = false;
        console.log("BrowserView: unresponsive");
        mainWindow.webContents.send(channels.APP_STATE, "error");
        mainWindow.removeBrowserView(appBrowserView);
        mainWindow.show();
        return;
    });

    // const url = `http://${ipaddress}/?${Date.now()}`;
    appBrowserView.webContents.loadURL("https://www.google.com");
    return;
    // mainWindow.webContents.loadURL(url); // appears to be usefull because it shows more info in the dev tools
}

module.exports = { loadSentry };

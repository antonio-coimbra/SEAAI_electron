const { BrowserWindow, BrowserView } = require("electron");
const { preloadScriptPath, iconPath } = require("./utils");

let mainWindow;
let appBrowserView;

function startAplication() {
    const isDev = true;
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 950,
        height: 720,
        titleBarStyle: "hidden",
        show: false,
        backgroundColor: "rgb(47, 47, 47)",
        icon: iconPath,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: preloadScriptPath,
        },
    });

    appBrowserView = new BrowserView();
    mainWindow.setBrowserView(appBrowserView);

    // and load the index.html of the app.
    // win.loadFile("index.html");
    mainWindow.loadURL("http://localhost:3000").then(() => {
        mainWindow.show();
    });

    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: "detach" });
    }
}

function getMainWindow() {
    return mainWindow;
}
function getAppBrowserView() {
    return appBrowserView;
}

module.exports = {
    startAplication,
    getMainWindow,
    getAppBrowserView,
};

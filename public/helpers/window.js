const { BrowserWindow, BrowserView } = require("electron");
const { preloadScriptPath, iconPath, setViewBounds } = require("./utils");

let mainWindow;
let appBrowserView;

function startAplication() {
    const isDev = true;
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 950,
        height: 720,
        minWidth: 470,
        minHeight: 495,
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

    // Catch the window "move", "resize" and "close" events
    // and re-center the BrowserView if it is already defined
    mainWindow.on("move", () => {
        autoResize();
    });
    mainWindow.on("resize", () => {
        autoResize();
    });
    mainWindow.on("restore", () => {
        autoResize();
    });
    mainWindow.once("focus", () => mainWindow.flashFrame(false));
}

function getMainWindow() {
    return mainWindow;
}
function getAppBrowserView() {
    return appBrowserView;
}

function autoResize() {
    if (getAppBrowserView().getBounds().width !== 0) {
        setViewBounds(mainWindow, appBrowserView);
    }
}

module.exports = {
    startAplication,
    getMainWindow,
    getAppBrowserView,
    autoResize,
};

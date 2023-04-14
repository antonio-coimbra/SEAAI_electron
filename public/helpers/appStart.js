const { BrowserWindow, BrowserView, ipcMain } = require("electron");
const { channels } = require("../../src/shared/constants");

const path = require("path");
const preloadScriptPath = path.join(__dirname, "../preload.js");
const iconPath = path.join(__dirname, "./favion.ico");

const TITLE_BAR_HEIGHT = 35;
const BROWSER_VIEW_INIT = "browser-view-init";

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
        setViewBounds();
    });
    mainWindow.on("resize", () => {
        setViewBounds();
    });
    mainWindow.on("restore", () => {
        setViewBounds();
    });
    mainWindow.once("focus", () => mainWindow.flashFrame(false));
}

function setViewBounds(option) {
    const bounds = mainWindow.getBounds();
    const browserViewActive = appBrowserView.getBounds().width !== 0;
    if (browserViewActive || option === BROWSER_VIEW_INIT) {
        appBrowserView.setBounds({
            x: 0,
            y: TITLE_BAR_HEIGHT,
            width: bounds.width,
            height: bounds.height - TITLE_BAR_HEIGHT,
        });
    }
}

// Top bar close button handling
ipcMain.handle(channels.CLOSE, () => {
    mainWindow.close();
});

// Top bar minimize button handling
ipcMain.handle(channels.MINIMIZE, () => {
    mainWindow.minimize();
});

// Top bar maximize button handling
ipcMain.handle(channels.MAXIMIZE, () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

// (Not implemented) fullscreen button/shortcut handling
ipcMain.handle(channels.SET_FULLSCREEN, () => {
    const bounds = mainWindow.getBounds();
    const browserViewActive =
        appBrowserView.getBounds().width !== 0 ||
        appBrowserView.getBounds().height !== 0;
    if (browserViewActive && mainWindow.isFullScreen()) {
        appBrowserView.setBounds({
            x: 0,
            y: TITLE_BAR_HEIGHT,
            width: bounds.width,
            height: bounds.height - TITLE_BAR_HEIGHT,
        });
    } else if (browserViewActive && !mainWindow.isFullScreen()) {
        appBrowserView.setBounds({
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height,
        });
    }
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

function getMainWindow() {
    return mainWindow;
}
function getAppBrowserView() {
    return appBrowserView;
}

module.exports = {
    startAplication,
    setViewBounds,
    getMainWindow,
    getAppBrowserView,
    BROWSER_VIEW_INIT,
};

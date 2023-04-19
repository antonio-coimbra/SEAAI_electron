const {
    BrowserWindow,
    BrowserView,
    ipcMain,
    net,
    globalShortcut,
    app,
} = require("electron");
const {
    channels,
    appStates,
    SET_FULLSCREEN,
    BROWSER_VIEW_INIT,
} = require("../../src/shared/constants");

const path = require("path");
const url = require("url");
const preloadScriptPath = path.join(__dirname, "../preload.js");
const iconPath = path.join(__dirname, "../icon.ico");

const TITLE_BAR_HEIGHT = 35;

let mainWindow;
let appBrowserView;

function startAplication() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 950,
        height: 720,
        minWidth: 470,
        minHeight: 495,
        titleBarStyle: "hidden",
        show: false,
        icon: iconPath,
        title: "Title",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: preloadScriptPath,
        },
    });

    appBrowserView = new BrowserView();
    mainWindow.setBrowserView(appBrowserView);

    // In production, set the initial browser path to the local bundle generated
    // by the Create React App build process.
    // In development, set it to localhost to allow live/hot-reloading.
    mainWindow
        .loadURL(
            app.isPackaged
                ? "http:localhost:3000"
                : `file://${path.join(__dirname, "../../build/index.html")}`
        )
        .then(() => {
            const { title } = require("../../package.json");
            mainWindow.setTitle(`${title}`);
            mainWindow.show();
        });

    // Automatically open Chrome's DevTools in development mode.
    if (!app.isPackaged) {
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

    globalShortcut.register("F11", () => {
        const browserViewActive =
            appBrowserView.getBounds().width !== 0 ||
            appBrowserView.getBounds().height !== 0;

        // Fullscreen mode is only available when the app is connected
        if (browserViewActive) {
            if (!mainWindow.isFullScreen()) {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
                setViewBounds(SET_FULLSCREEN);
            }
        }
    });
    globalShortcut.register("esc", () => {
        if (mainWindow.isFullScreen()) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            setViewBounds();
        }
    });
}

function setViewBounds(option) {
    const bounds = mainWindow.getBounds();
    const browserViewActive = appBrowserView.getBounds().width !== 0;
    switch (option) {
        default:
            if (browserViewActive) {
                appBrowserView.setBounds({
                    x: 0,
                    y: TITLE_BAR_HEIGHT,
                    width: bounds.width,
                    height: bounds.height - TITLE_BAR_HEIGHT,
                });
            }
            break;
        case BROWSER_VIEW_INIT:
            appBrowserView.setBounds({
                x: 0,
                y: TITLE_BAR_HEIGHT,
                width: bounds.width,
                height: bounds.height - TITLE_BAR_HEIGHT,
            });

            break;
        case SET_FULLSCREEN:
            appBrowserView.setBounds({
                x: 0,
                y: 0,
                width: bounds.width,
                height: bounds.height,
            });

            break;
    }
}

function checkConnection() {
    if (!net.isOnline) {
        console.log("No internet connection");
        mainWindow.webContents.send(channels.APP_STATE, appStates.ERROR_STATE);
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

// (Not implemented) fullscreen button handling
ipcMain.handle(channels.SET_FULLSCREEN, () => {
    const browserViewActive =
        appBrowserView.getBounds().width !== 0 ||
        appBrowserView.getBounds().height !== 0;
    if (browserViewActive) {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
        if (browserViewActive && mainWindow.isFullScreen()) {
            setViewBounds(SET_FULLSCREEN);
        } else if (browserViewActive && !mainWindow.isFullScreen()) {
            setViewBounds();
        }
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
    checkConnection,
    getMainWindow,
    getAppBrowserView,
    BROWSER_VIEW_INIT,
};

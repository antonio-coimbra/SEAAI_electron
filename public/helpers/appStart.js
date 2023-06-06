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
    TITLE_BAR_HEIGHT,
    MAC_TITLE_BAR_HEIGHT,
} = require("../../src/shared/constants");
const { isMac } = require("./detectPlatform");

const { saveWindowBounds, setWasMaximized } = require("./storage");
const path = require("path");

let mainWindow;
let appBrowserView;

function startAplication() {
    app.whenReady().then(() => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 970,
            height: 750,
            minWidth: 520,
            minHeight: 750,
            titleBarStyle: "hidden",
            show: false,
            backgroundColor: "#191A1A",
            icon: path.join(__dirname, "../icon.ico"),
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, "../preload.js"),
                // devTools: false, // UNCOMMENT ON RELEASE
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
                    ? `file://${path.join(__dirname, "../index.html")}`
                    : "http:localhost:3000"
            )
            .then(() => {
                const { title } = require("../../package.json");
                mainWindow.setTitle(`${title}`);
                mainWindow.maximize();
                mainWindow.show();
            });

        // Automatically open Chrome's DevTools in development mode.
        if (!app.isPackaged) {
            mainWindow.webContents.openDevTools({ mode: "detach" });
        }

        // Catch the window "move", "resize" and "close" events
        // and re-center the BrowserView
        mainWindow.on("move", () => {
            setViewBounds();
        });
        mainWindow.on("resize", () => {
            setViewBounds();
        });
        mainWindow.on("restore", () => {
            setViewBounds();
        });

        // Send maximize and unmaximize info to the renderer
        mainWindow.on("unmaximize", () => {
            mainWindow.webContents.send(channels.MAXRES, false);
            const browserViewActive =
                appBrowserView.getBounds().width !== 0 ||
                appBrowserView.getBounds().height !== 0;
            if (browserViewActive) setWasMaximized(false);
        });
        mainWindow.on("maximize", () => {
            mainWindow.webContents.send(channels.MAXRES, true);
            const browserViewActive =
                appBrowserView.getBounds().width !== 0 ||
                appBrowserView.getBounds().height !== 0;
            if (browserViewActive) setWasMaximized(true);
        });

        mainWindow.on("resized", () => {
            saveWindowBounds(mainWindow.getSize());
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
                } else {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    setViewBounds();
                }
            }
        });
    });
}

function setViewBounds(option) {
    titleBarHeight = isMac ? MAC_TITLE_BAR_HEIGHT : TITLE_BAR_HEIGHT;
    const bounds = mainWindow.getBounds();
    const browserViewActive = appBrowserView.getBounds().width !== 0;
    switch (option) {
        default:
            if (browserViewActive) {
                appBrowserView.setBounds({
                    x: 0,
                    y: titleBarHeight,
                    width: bounds.width,
                    height: bounds.height - titleBarHeight,
                });
            }
            break;
        case BROWSER_VIEW_INIT:
            appBrowserView.setBounds({
                x: 0,
                y: titleBarHeight,
                width: bounds.width,
                height: bounds.height - titleBarHeight,
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
    mainWindow = null;

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    if (process.platform !== "darwin") {
        app.quit();
    } else {
        app.quit();
    }
});

app.on("window-all-closed", () => {
    mainWindow = null;
    app.quit();
});

// Top bar minimize button handling
ipcMain.handle(channels.MINIMIZE, () => {
    mainWindow.minimize();
});

// Top bar maximize button handling
ipcMain.handle(channels.MAXIMIZE, () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
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
};

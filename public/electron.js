const { app, ipcMain, BrowserWindow, net, protocol } = require("electron");
const { startAplication, getMainWindow } = require("./helpers/appStart");
const { zeroconf } = require("./helpers/zeroconf");
const { channels, appStates } = require("../src/shared/constants");
const { isThisSentryUserInput } = require("./helpers/isThisSentry");
const { loadSentry } = require("./helpers/loadSentry");
const path = require("path");

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
    protocol.registerHttpProtocol(
        "file",
        (request, callback) => {
            const url = request.url.substr(8);
            callback({ path: path.normalize(`${__dirname}/${url}`) });
        },
        (error) => {
            if (error) console.error("Failed to register protocol");
        }
    );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Create the browser window and initialize the appBrowserView
    startAplication();
    setupLocalFilesNormalizerProxy();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) startAplication();
});

// User entered the IP address
ipcMain.handle(channels.SEND_IP, (event, ipaddress) => {
    console.log(`entered IP address: ${ipaddress}`);
    const mainWindow = getMainWindow();
    mainWindow.webContents.send(channels.APP_STATE, appStates.CONNECTING_STATE);

    // Check if there is internet connection
    if (!net.isOnline()) {
        console.log("No internet connection");
        getMainWindow.webContents.send(
            channels.APP_STATE,
            appStates.ERROR_STATE
        );
    } else isThisSentryUserInput(ipaddress, loadSentry);
});

ipcMain.handle(channels.AUTO_CONNECT, () => {
    // Check if there is internet connection
    if (!net.isOnline()) {
        console.log("No internet connection");
        getMainWindow.webContents.send(
            channels.APP_STATE,
            appStates.NO_CONNECTION_ERROR_STATE
        );
    } else zeroconf(getMainWindow());
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://sentry-electron-app.com";
app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
            event.preventDefault();
        }
    });
});

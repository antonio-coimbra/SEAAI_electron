const { app, ipcMain, BrowserWindow } = require("electron");
const { request } = require("./helpers/request");
const { channels } = require("../src/shared/constants");
const { startAplication, getMainWindow } = require("./helpers/window");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Create the browser window and initialize the appBrowserView
    startAplication();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) startAplication();
});

// Top bar close button handling
ipcMain.handle(channels.CLOSE, () => {
    app.quit();
});

// Top bar minimize button handling
ipcMain.handle(channels.MINIMIZE, () => {
    getMainWindow().minimize();
});

// Top bar maximize button handling
ipcMain.handle(channels.MAXIMIZE, () => {
    getMainWindow().isMaximized()
        ? getMainWindow().restore()
        : getMainWindow().maximize();
});

// (Not implemented) fullscreen button/shortcut handling
ipcMain.handle(channels.SET_FULLSCREEN, () => {
    getMainWindow().setFullScreen(true);
});

// User entered the IP address
ipcMain.handle(channels.GET_IP, function (event, ipaddress) {
    console.log(`entered IP address: ${ipaddress}`);
    const mainWindow = getMainWindow();

    mainWindow.webContents.send(channels.APP_STATE, "connecting");

    // Check if the IP address is from a SENTRY unit
    request(ipaddress);
});

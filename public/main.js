// const { test } = require("../src/shared/webservice");
const { setViewBounds } = require("./helpers/utils");
const { request } = require("./helpers/request");
const { app, ipcMain, BrowserWindow } = require("electron");

const { channels } = require("../src/shared/constants");

const {
  startAplication,
  getMainWindow,
  getAppBrowserView,
} = require("./helpers/window");

// Used to prevent re-centering BrowserView when it is not defined yet
let browserViewActive = false;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Create the browser window
  startAplication();

  const mainWindow = getMainWindow();
  const appBrowserView = getAppBrowserView();

  // Catch the window "move", "resize" and "close" events
  // and re-center the BrowserView if it is already defined
  mainWindow.on("move", () => {
    if (browserViewActive) setViewBounds(mainWindow, appBrowserView);
  });

  mainWindow.on("resize", () => {
    if (browserViewActive) setViewBounds(mainWindow, appBrowserView);
  });

  mainWindow.on("restore", () => {
    if (browserViewActive) setViewBounds(mainWindow, appBrowserView);
  });

  mainWindow.once("focus", () => mainWindow.flashFrame(false));
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

//
ipcMain.on(channels.CLOSE, () => {
  app.quit();
});

ipcMain.on(channels.MINIMIZE, () => {
  getMainWindow().minimize();
});

ipcMain.on(channels.MAXIMIZE, () => {
  getMainWindow().isMaximized()
    ? getMainWindow().restore()
    : getMainWindow().maximize();
});

ipcMain.on(channels.SET_FULLSCREEN, () => {
  getMainWindow().setFullScreen(true);
});



// User entered the IP address
ipcMain.handle("get-ip", function (event, value) {
  console.log(`entered IP address: ${value}`);
  const mainWindow = getMainWindow();
  const appBrowserView = getAppBrowserView();



  mainWindow.webContents.send(channels.APP_STATE, "connecting");

  // Server comunication
//  request("http://localhost:8080/isthissentry", value, loadSentry);
  loadSentry(mainWindow, appBrowserView, value)
  
});

function loadSentry(mainWindow, appBrowserView, value) {
  let SUCCESS = true;


  

  appBrowserView.webContents.once("did-finish-load", () => {
    if (SUCCESS) {
      // If the IP address is valid, render only the TitleBar component
      mainWindow.webContents.send(channels.APP_STATE, "normal-view");
      browserViewActive = true;

      console.log("borwserView: did-finish-load");
      mainWindow.maximize();
      setViewBounds(mainWindow, appBrowserView);
    }
    mainWindow.show();
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

  console.log(`Loading http://${value}/`);
  appBrowserView.webContents
        .loadURL(`http://${value}/`)
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {console.log(err)});
}
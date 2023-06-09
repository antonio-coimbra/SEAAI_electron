const { app, ipcMain, BrowserWindow, net, protocol } = require("electron");
const { startAplication, getMainWindow } = require("./helpers/appStart");
const { zeroconf } = require("./helpers/zeroconf");
const {
    channels,
    appStates,
    HELP_EMAIL_URL,
} = require("../src/shared/constants");
const {
    isThisSentryUserInput,
    firstIsThisSentry,
} = require("./helpers/isThisSentry");
const { loadSentry } = require("./helpers/loadSentry");
const { getLastIP } = require("./helpers/storage");
const { isAlive } = require("./helpers/isAlive");
const path = require("path");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Create the browser window and initialize the appBrowserView
    startAplication();
});

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", () => {
    console.log("Activating app on macOS");
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
    } else {
        const lastIP = getLastIP();
        console.log(`lastIP: ${lastIP}`);
        isAlive(lastIP)
            .then((isAlive) => {
                console.log(`lastIP ${lastIP} is available = ${isAlive}`);
                if (isAlive) {
                    firstIsThisSentry(lastIP, zeroconf, "last-ip").catch(
                        (err) => {
                            console.log(
                                `lastIP ${lastIP} isThisSentry error = ${err}`
                            );
                            tryLocalSentry();
                        }
                    );
                } else {
                    console.log(`lastIP ${lastIP} is not available 1`);
                    tryLocalSentry();
                }
            })
            .catch((err) => {
                console.log(`lastIP ${lastIP} is not available 2`);
                tryLocalSentry();
            });
        // tryLocalSentry(); // only for debugging
    }
});

function tryLocalSentry() {
    const localSentry = "sentry.local";
    isAlive(localSentry)
        .then((isAlive) => {
            console.log(`${localSentry} is available = ${isAlive}`);
            if (isAlive) {
                firstIsThisSentry(localSentry, zeroconf, "local-sentry").catch(
                    (err) => {
                        console.log(
                            `${localSentry} isThisSentry error = ${err}`
                        );
                        zeroconf(0);
                    }
                );
            } else {
                console.log(`${localSentry} is not available 1`);
                zeroconf(0);
            }
        })
        .catch((err) => {
            console.log(`${localSentry} is not available 2`);
            zeroconf(0);
        });
    // zeroconf(0); // only for debugging
}

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "http://" + getLastIP() + "/?";
app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        // console.log(navigationUrl);
        // console.log(event);
        if (
            !allowedNavigationDestinations.includes(parsedUrl.origin) &&
            navigationUrl !== HELP_EMAIL_URL &&
            !navigationUrl.includes("https://wa.me/message") &&
            !navigationUrl.includes("whatsapp")
        ) {
            event.preventDefault();
        } else console.log("will navigate to " + navigationUrl);
    });
});

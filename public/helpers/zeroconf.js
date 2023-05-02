const { isThisSentryRecursive } = require("./isThisSentry");
const { recursiveLoadSentry } = require("./loadSentry");
const { getMainWindow } = require("./appStart");
const { ipcMain } = require("electron");
const { channels, appStates } = require("../../src/shared/constants");
const mdns = require("multicast-dns")();

let res = 0;
let appIsConnected = false;
let stateInRec;

function onError() {
    // go to error page and manual ip insertion
    mdns.destroy();
    getMainWindow().webContents.send(
        channels.APP_STATE,
        appStates.ERROR_AUTO_CONNECTION_STATE
    );
}

function recursiveIPCheck(response, i) {
    console.log("state in recursive iteration " + i + ": " + stateInRec);
    if (i < response.answers.length) {
        if (response.answers[i].name.includes("oscar.local") && response) {
            let ipFromZeroConf = response
                ? response.answers[i]
                    ? response.answers[i].data
                    : null
                : null;
            console.log(`zeroconf: ${ipFromZeroConf}`);
            return isThisSentryRecursive(
                ipFromZeroConf,
                recursiveLoadSentry,
                i,
                response,
                recursiveIPCheck
            );
        } else return -1;
    } else return -1;
}

function zeroconf(mainWindow) {
    mdns.on("response", function (response) {
        mdns.destroy(); // closes the socket
        let i = 0;
        res = recursiveIPCheck(response, i);
        console.log(`recursiveIPCheck result: ${res}`);
        if (res === -1 || res === null) {
            console.log(`recursiveIPCheck FAILED`);
            onError();
        } else if (res === 0) {
            console.log(`recursiveIPCheck didn't return`);
            onError();
        }
    });

    mdns.query({
        questions: [
            {
                name: "oscar.local",
                type: "A",
            },
        ],
    });

    // close the connection after 3 seconds
    // Send app to insert ip state
    setTimeout(() => {
        if (!appIsConnected) {
            console.log("auto connect timeout");
            onError(mainWindow);
        }
    }, 10000);
}

ipcMain.handle(channels.CANCEL_AUTO_CONNECT, () => {
    console.log("canceled auto connect");
    mdns.destroy();
});

ipcMain.on(channels.ELECTRON_APP_STATE, (event, currentState) => {
    appIsConnected = currentState === appStates.CONNECTED ? true : false;
});

module.exports = { zeroconf };

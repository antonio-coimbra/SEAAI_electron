const { isThisSentryAuto } = require("./isThisSentry");
const { getMainWindow } = require("./appStart");
const { ipcMain } = require("electron");
const { channels, appStates } = require("../../src/shared/constants");
const mdns = require("multicast-dns")();
const { isAlive } = require("./isAlive");

let appIsConnected = false;
let gotResponse = false;
let sentryIsConnected = false;
let ipIsAlive = false;
const possibleIPs = [];
const aliveIPs = [];

function onError() {
    // go to error page and manual ip insertion
    if (mdns) mdns.destroy();
    mainWindow = getMainWindow();
    if (mainWindow)
        mainWindow.webContents.send(
            channels.APP_STATE,
            appStates.RETRY_AUTO_CONNECTION_STATE
        );
}

function zeroconf() {
    console.log("zeroconf query started");
    mdns.on("response", function (response) {
        if (response.answers[0].name.includes("oscar")) {
            gotResponse = true; //Got a response form oscar.local
            mdns.destroy(); // closes the socket

            for (let i = 0; i < response.answers.length; i++) {
                console.log("oscar.local IP: " + response.answers[i].data);
                possibleIPs.push(response.answers[i].data);
            }

            for (let i = 0; i < possibleIPs.length; i++) {
                isAlive(possibleIPs[i])
                    .then((isAlive) => {
                        if (!appIsConnected) {
                            console.log(
                                `ip ${possibleIPs[i]} is alive = ${isAlive}`
                            );
                            if (isAlive) {
                                // this IP is reachable
                                aliveIPs.push(possibleIPs[i]);
                            }
                            ipIsAlive = isAlive;
                        }
                    })
                    .catch((err) => {
                        // console.log(err);
                        console.log(`ip ${possibleIPs[i]} is not alive`);
                        ipIsAlive = false;
                    })
                    .finally(() => {
                        if (
                            aliveIPs.length > 0 &&
                            aliveIPs.indexOf(possibleIPs[i]) === 0 &&
                            ipIsAlive
                        ) {
                            sentryIsConnected = isThisSentryAuto(aliveIPs);
                        }
                    });
                if (sentryIsConnected) break;
            }
        }
    });

    mdns.query({
        questions: [
            {
                name: "oscar.local",
                type: "*",
            },
        ],
    });

    // close the connection after 15 seconds
    // Send app to insert ip state
    setTimeout(() => {
        if (!appIsConnected && (!gotResponse || aliveIPs.length === 0)) {
            console.log("auto connect timeout");
            onError();
        }
    }, 20000);
}

ipcMain.handle(channels.CANCEL_AUTO_CONNECT, () => {
    console.log("canceled auto connect");
    mdns.destroy();
});

ipcMain.on(channels.ELECTRON_APP_STATE, (event, currentState) => {
    appIsConnected = currentState === appStates.CONNECTED ? true : false;
    if (appIsConnected && mdns) mdns.destroy();
});

module.exports = { zeroconf };

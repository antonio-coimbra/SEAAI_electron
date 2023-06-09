const { isThisSentryAuto } = require("./isThisSentry");
const { getMainWindow } = require("./appStart");
const { ipcMain } = require("electron");
const { channels, appStates } = require("../../src/shared/constants");
const { isAlive } = require("./isAlive");

let appIsConnected = false;
let gotResponse = false;
let sentryIsConnected = false;
let ipIsAlive = false;
const possibleIPs = [];
const aliveIPs = [];

function onError(mdns) {
    // go to error page and manual ip insertion
    if (mdns) mdns.destroy();
    const mainWindow = getMainWindow();
    if (mainWindow)
        mainWindow.webContents.send(
            channels.APP_STATE,
            appStates.RETRY_AUTO_CONNECTION_STATE
        );
}

const name = [
    "sentry.local",
    "sentry-2.local",
    "sentry-3.local",
    "oscar.local",
    "oscar-2.local",
    "oscar-3.local",
];

function zeroconf(i) {
    const mdns = require("multicast-dns")();
    console.log("zeroconf query started --> " + name[i]);
    mdns.on("response", function (response) {
        if (
            response.answers[0].name.includes("oscar") ||
            response.answers[0].name.includes("sentry")
        ) {
            gotResponse = true; //Got a response form oscar.local
            mdns.destroy(); // closes the socket

            for (let i = 0; i < response.answers.length; i++) {
                console.log("Recieved IP: " + response.answers[i].data);
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
                            sentryIsConnected = isThisSentryAuto(
                                aliveIPs,
                                zeroconf
                            );
                        }
                    });
                if (sentryIsConnected) break;
            }
        }
    });

    mdns.query({
        questions: [
            {
                name: name[i],
                type: "*",
            },
        ],
    });

    // close the connection after 15 seconds
    // Send app to insert ip state
    setTimeout(() => {
        if (!appIsConnected && (!gotResponse || aliveIPs.length === 0)) {
            console.log(name[i] + " auto connect timeout");
            if (i + 1 > name.length) {
                onError(mdns);
            } else zeroconf(i + 1);
        }
    }, 5000);
}

ipcMain.on(channels.ELECTRON_APP_STATE, (event, currentState) => {
    appIsConnected = currentState === appStates.CONNECTED ? true : false;
});

module.exports = { zeroconf };

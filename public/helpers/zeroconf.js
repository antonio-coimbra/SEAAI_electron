const { isThisSentryAuto } = require("./isThisSentry");
const { getMainWindow } = require("./appStart");
const { ipcMain } = require("electron");
const { channels, appStates } = require("../../src/shared/constants");
const mdns = require("multicast-dns")();
const { isAlive } = require("./isAlive");

let appIsConnected = false;
let gotResponse = false;
const possibleIPs = [];
const aliveIPs = [];

function onError() {
    // go to error page and manual ip insertion
    mdns.destroy();
    getMainWindow().webContents.send(
        channels.APP_STATE,
        appStates.ERROR_AUTO_CONNECTION_STATE
    );
}

function zeroconf() {
    mdns.on("response", function (response) {
        if (response.answers[0].name.includes("oscar")) {
            gotResponse = true; //Got a response form oscar.local
            mdns.destroy(); // closes the socket

            for (let i = 0; i < response.answers.length; i++) {
                console.log("oscar.local IP:" + response.answers[i].data);
                possibleIPs.push(response.answers[i].data);
            }

            let ipIsAlive;
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
                        console.log(`ip ${possibleIPs[i]} is not alive`);
                        ipIsAlive = true;
                    })
                    .finally(() => {
                        if (
                            aliveIPs.length > 0 &&
                            aliveIPs.indexOf(possibleIPs[i]) === 0 &&
                            ipIsAlive
                        ) {
                            console.log(
                                "This IP will be attempted" + possibleIPs[i]
                            );
                        } else if (aliveIPs.length > 0 && ipIsAlive) {
                            console.log(
                                "This IP will NOT be attempted" + possibleIPs[i]
                            );
                        } else if (!ipIsAlive) {
                            console.log(
                                "This IP is not reachable" + possibleIPs[i]
                            );
                        }
                    });
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
        if (!appIsConnected && !gotResponse) {
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
});

module.exports = { zeroconf };

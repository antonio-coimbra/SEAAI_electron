const WebSocket = require("ws");
const { getMainWindow } = require("./appStart");
const { loadSentry } = require("./loadSentry");
const {
    channels,
    appStates,
    SIGNAL_SERVER_PORT,
    SIGNAL_SERVER_URL,
    SENTRY_RESPONSE,
} = require("../../src/shared/constants");

function onErrorUserInput(socket) {
    const mainWindow = getMainWindow();
    if (mainWindow) {
        mainWindow.webContents.send(channels.APP_STATE, appStates.ERROR_STATE);
    }
    socket.close();
    return null;
}

function onErrorAuto() {
    const mainWindow = getMainWindow();
    if (mainWindow) {
        mainWindow.webContents.send(
            channels.APP_STATE,
            appStates.RETRY_AUTO_CONNECTION_STATE
        );
    }
    return null;
}

function onSuccess(socket, ipaddress, zeroconf, option) {
    socket.close();
    return loadSentry(ipaddress, zeroconf);
}

function isThisSentryUserInput(ipaddress) {
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        console.log("WebSocket error");
        message = event.message;
        console.log(message);
        onErrorUserInput(socket);
    });

    socket.on("close", (event) => {
        // console.log("WebSocket closed: " + event);
    });

    socket.on("message", (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            onSuccess(socket, ipaddress);
        } else {
            console.log(`${ipaddress} didn't work`);
            return onErrorUserInput(socket);
        }
    });
}

function isThisSentryAuto(IPs) {
    return recursiveIPValidator(IPs, 0);
}

function recursiveIPValidator(IPs, i) {
    if (i >= IPs.length) {
        console.log("No more IPs to validate. Exiting auto connection");
        return onErrorAuto();
    }

    console.log("attempting to connect to " + IPs[i]);

    let wentNextIP = false;
    const ipaddress = IPs[i];
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        console.log("WebSocket error");
        message = event.message;
        console.log(message);
        socket.close();
        if (!wentNextIP) {
            wentNextIP = true;
            return recursiveIPValidator(IPs, i + 1);
        }
    });

    socket.on("close", (event) => {
        // console.log(ipaddress + " webSocket closed: " + event);
    });

    socket.on("message", (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            return onSuccess(socket, ipaddress);
        } else {
            console.log(`${ipaddress} didn't work`);
            socket.close();
            if (!wentNextIP) {
                wentNextIP = true;
                return recursiveIPValidator(IPs, i + 1);
            }
        }
    });

    setTimeout((wentNextIP) => {
        console.log("foi next: " + wentNextIP);
        if (!wentNextIP) {
            console.log(`${ipaddress} auto connect timeout`);
            wentNextIP = true;
            return recursiveIPValidator(IPs, i + 1);
        }
    }, 10000);
}

async function asyncIsThisSentry(lastIP, zeroconf) {
    console.log("attempting to connect to lastIP: " + lastIP);
    const ipaddress = lastIP;
    let failed = false;
    let appIsConnected = false;
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        if (!failed) {
            console.log("WebSocket error on LastIP");
            message = event.message;
            console.log(message);
            failed = true;
            socket.close();
            zeroconf();
            return null;
        }
    });

    socket.on("close", (event) => {
        // console.log(ipaddress + " webSocket closed: " + event);
    });

    socket.on("message", async (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            socket.close();
            console.log("will load LastIP");
            appIsConnected = true;
            return await loadSentry(ipaddress, zeroconf, "last-ip");
        } else {
            console.log(`lastIP didn't work`);
            zeroconf();
            return false;
        }
    });

    setTimeout(() => {
        if (!failed && !appIsConnected) {
            console.log(`${ipaddress} lastIP auto connect timeout`);
            failed = true;
            socket.close();
            zeroconf();
            return null;
        }
    }, 10000);
}

module.exports = { isThisSentryUserInput, isThisSentryAuto, asyncIsThisSentry };

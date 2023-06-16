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
    console.log("user input error");
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
    return loadSentry(ipaddress, zeroconf, option);
}

function isThisSentryUserInput(ipaddress) {
    let failed = false;
    let loadedSentry = false;
    console.log("isThisSentryUserInput: " + ipaddress);
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        if (!failed && !loadedSentry) {
            failed = true;
            console.log("WebSocket error on user input");
            message = event.message;
            console.log(message);
            return onErrorUserInput(socket);
        }
    });

    socket.on("close", (event) => {
        // console.log("WebSocket closed: " + event);
    });

    socket.on("message", (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            loadedSentry = true;
            onSuccess(socket, ipaddress, "user-input");
        } else {
            if (!failed && !loadedSentry) {
                failed = true;
                console.log(`${ipaddress} is not a sentry`);
                return onErrorUserInput(socket);
            }
        }
    });

    setTimeout(() => {
        console.log("falhou: " + failed);
        console.log("loadedSentry: " + loadedSentry);
        if (!failed && !loadedSentry) {
            console.log(`${ipaddress} auto connect timeout`);
            failed = true;
            return onErrorUserInput(socket);
        }
    }, 10000);
}

function isThisSentryAuto(IPs, zeroconf) {
    console.log("isThisSentryAuto: " + IPs[0]);
    return recursiveIPValidator(IPs, 0, zeroconf);
}

function recursiveIPValidator(IPs, i, zeroconf) {
    if (i >= IPs.length) {
        console.log("No more IPs to validate. Exiting auto connection");
        return onErrorAuto();
    }

    console.log("attempting to connect to " + IPs[i]);

    let wentNextIP = false;
    let appIsConnected = false;
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
            appIsConnected = true;
            return onSuccess(socket, ipaddress, zeroconf, "auto-connect", i);
        } else {
            console.log(`${ipaddress} didn't work`);
            socket.close();
            if (!wentNextIP) {
                wentNextIP = true;
                return recursiveIPValidator(IPs, i + 1);
            }
        }
    });

    setTimeout(() => {
        if (!wentNextIP && !appIsConnected) {
            console.log(`${ipaddress} auto connect timeout`);
            wentNextIP = true;
            return recursiveIPValidator(IPs, i + 1);
        }
    }, 10000);
}

async function lastIPIsThisSentry(lastIP, zeroconf) {
    console.log("LastIP isThisSentry: " + lastIP);
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
            zeroconf(0);
            return null;
        }
    });

    socket.on("close", (event) => {
        // console.log(ipaddress + " webSocket closed: " + event);
    });

    socket.on("message", async (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            console.log("will load LastIP");
            appIsConnected = true;
            return onSuccess(socket, ipaddress, zeroconf, "last-ip");
        } else {
            console.log(`lastIP didn't work`);
            zeroconf(0);
            return false;
        }
    });

    setTimeout(() => {
        if (!failed && !appIsConnected) {
            console.log(`${ipaddress} lastIP auto connect timeout`);
            failed = true;
            socket.close();
            zeroconf(0);
            return null;
        }
    }, 10000);
}

module.exports = {
    isThisSentryUserInput,
    isThisSentryAuto,
    lastIPIsThisSentry,
};

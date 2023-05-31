const WebSocket = require("ws");
const { getMainWindow } = require("./appStart");
const {
    channels,
    appStates,
    SIGNAL_SERVER_PORT,
    SIGNAL_SERVER_URL,
    SENTRY_RESPONSE,
} = require("../../src/shared/constants");

let wentToNextIP;

function onError(socket) {
    const mainWindow = getMainWindow();
    mainWindow.webContents.send(channels.APP_STATE, appStates.ERROR_STATE);
    socket.close();
    return null;
}

function isNotSentryError(socket) {
    const mainWindow = getMainWindow();
    mainWindow.webContents.send(
        channels.APP_STATE,
        appStates.ERROR_IS_NOT_SENTRY
    );
    socket.close();
    return null;
}

function onRecursiveError(socket, recursive, response, i) {
    if (!wentToNextIP) {
        console.log("leaving " + response.answers[i].data);
        socket.close();
        wentToNextIP = true;
        return recursive(response, i + 1);
    }
}

function isThisSentry(ipaddress, loadSentry) {
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        console.log("WebSocket error");
        message = event.message;
        console.log(message);
        if (message.includes("Unexpected server response")) {
            return isNotSentryError(socket);
        } else if (message.includes("ETIMEDOUT")) {
            return onError(socket);
        } else if (message.includes("EHOSTUNREACH")) {
            return onError(socket);
        } else onError(socket);
    });

    socket.on("close", (event) => {
        console.log("WebSocket closed: " + event.code);
        return onError(socket);
    });

    socket.on("message", (event) => {
        var data = event.data;
        console.log(JSON.parse(data).topic);
        if (JSON.parse(data).topic === SENTRY_RESPONSE) {
            socket.close();
            return loadSentry(ipaddress);
        } else {
            console.log(`${ipaddress} didn't work`);
            return onRecursiveError(recursive, zeroConfResponse, i);
        }
    });
}

function isThisSentryRecursive(
    ipaddress,
    loadSentry,
    i,
    zeroConfResponse,
    recursive
) {
    wentToNextIP = false;

    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        message = event.message;
        console.log("Webcocket ERROR on " + ipaddress + ": " + message);
        return onRecursiveError(socket, recursive, zeroConfResponse, i);
    });

    socket.on("close", (event) => {
        console.log("WebSocket closed: " + event.code);
        return onRecursiveError(socket, recursive, zeroConfResponse, i);
    });

    socket.on("message", (data) => {
        console.log(data);
        console.log(JSON.parse(data).topic);
        if (JSON.parse(data).topic === SENTRY_RESPONSE) {
            socket.close();
            return loadSentry(ipaddress);
        } else {
            console.log(`${ipaddress} didn't work`);
            return onRecursiveError(socket, recursive, zeroConfResponse, i);
        }
    });

    setTimeout(() => {
        socket.close();
        console.log(`${ipaddress} socket timeout`);
        return onRecursiveError(socket, recursive, zeroConfResponse, i);
    }, 10000);
}

module.exports = { isThisSentry, isThisSentryRecursive };

const WebSocket = require("ws");
const { getMainWindow } = require("./appStart");
const {
    channels,
    appStates,
    SIGNAL_SERVER_PORT,
    SIGNAL_SERVER_URL,
} = require("../../src/shared/constants");

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

function onRecursiveError(recursive, response, i) {
    return recursive(response, i + 1);
}

function isThisSentry(ipaddress, loadSentry) {
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.onerror = function (event) {
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
    };

    socket.onclose = function (event) {
        console.log("WebSocket closed");
        console.log(event.code);
    };

    socket.onmessage = function (event) {
        var data = event.data;
        console.log(JSON.parse(data).topic);
        if (JSON.parse(data).topic === "HELLO") {
            socket.close();
            return loadSentry(ipaddress);
        } else isNotSentryError();
    };
}

function isThisSentryRecursive(
    ipaddress,
    loadSentry,
    i,
    zeroConfResponse,
    recursive
) {
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.onerror = function (event) {
        console.log("WebSocket error");
        return onRecursiveError(recursive, zeroConfResponse, i);
    };

    socket.onclose = function (event) {
        console.log("WebSocket closed");
        console.log(event.code);
    };

    socket.onmessage = function (event) {
        var data = event.data;
        console.log(JSON.parse(data).topic);
        if (JSON.parse(data).topic === "HELLO") {
            socket.close();
            return loadSentry(ipaddress);
        } else return onRecursiveError(recursive, zeroConfResponse, i);
    };
}

module.exports = { isThisSentry, isThisSentryRecursive };

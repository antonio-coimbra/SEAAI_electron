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
    mainWindow.webContents.send(channels.APP_STATE, appStates.ERROR_STATE);
    socket.close();
    return null;
}

function onErrorAuto(socket) {
    const mainWindow = getMainWindow();
    socket.close();
    return null;
}

function onSuccess(socket, ipaddress) {
    socket.close();
    return loadSentry(ipaddress);
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
        console.log("WebSocket closed: " + event);
        // return onError(socket);
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

function isThisSentryAuto(ipaddress) {
    const socket = new WebSocket(
        "ws://" + ipaddress + ":" + SIGNAL_SERVER_PORT + SIGNAL_SERVER_URL
    );

    socket.on("error", (event) => {
        console.log("WebSocket error");
        message = event.message;
        console.log(message);
        onErrorAuto(socket);
    });

    socket.on("close", (event) => {
        console.log("WebSocket closed: " + event);
        // return onError(socket);
    });

    socket.on("message", (data) => {
        const message = data ? JSON.parse(data).topic : null;
        if (message === SENTRY_RESPONSE) {
            onSuccess(socket, ipaddress);
        } else {
            console.log(`${ipaddress} didn't work`);
            return onErrorAuto(socket);
        }
    });
}

module.exports = { isThisSentryUserInput, isThisSentryAuto };

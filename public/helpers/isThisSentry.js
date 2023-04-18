const { net } = require("electron");
const { getMainWindow } = require("./appStart");
const { channels } = require("../../src/shared/constants");
// const SENTRY_SERVER_URL = "";
const SENTRY_RESPONSE = "iamsentry";
const TEST_SERVER_URL = "http://localhost:8080/isthissentry";

function onError() {
    const mainWindow = getMainWindow();

    mainWindow.webContents.send(channels.APP_STATE, "error");
}

function onRecursiveError(recursive, response, i) {
    recursive(response, i + 1);
}

function isThisSentry(ipaddress, loadSentry) {
    const data = [];
    const request = net.request(TEST_SERVER_URL);
    request.on("response", (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        if (response.statusCode !== 200) {
            // Send app back to get ip address/error state
            onError();
            return null;
        }
        response.on("data", (chunk) => {
            data.push(chunk);
        });
        response.on("end", () => {
            const dataString = Buffer.concat(data).toString();
            if (dataString === SENTRY_RESPONSE) {
                return loadSentry(ipaddress);
            } else {
                // Send app back to get ip address/error state
                onError();
                return null;
            }
        });
        response.on("error", (error) => {
            console.log(`Response error: ${JSON.stringify(error)}`);
            // Send app back to get ip address/error state
            onError();
            return null;
        });
        response.on("abort", () => {
            console.log("Request is Aborted");
            onError();
            return null;
        });
    });
    request.on("finish", () => {
        console.log("Request is Finished");
    });
    request.on("abort", () => {
        console.log("Request is Aborted");
        // Send app back to get ip address/error state
        onError();
        return null;
    });
    request.on("error", (error) => {
        console.log(`Request error: ${JSON.stringify(error)}`);
        // Send app back to get ip address/error state
        onError();
        return null;
    });
    request.on("close", () => {
        console.log("Last Transaction has occurred");
    });
    request.end();
}

function isThisSentryRecursive(
    ipaddress,
    loadSentry,
    i,
    zeroConfResponse,
    recursive
) {
    const data = [];
    const request = net.request(TEST_SERVER_URL);
    request.on("response", (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        if (response.statusCode !== 200) {
            // Send app back to get ip address/error state
            return onRecursiveError(recursive, zeroConfResponse, i);
        }
        response.on("data", (chunk) => {
            data.push(chunk);
        });
        response.on("end", () => {
            const dataString = Buffer.concat(data).toString();
            if (dataString === SENTRY_RESPONSE) {
                return loadSentry(ipaddress, i, zeroConfResponse, recursive);
            } else {
                // Send app back to get ip address/error state
                return onRecursiveError(recursive, zeroConfResponse, i);
            }
        });
        response.on("error", (error) => {
            console.log(`Response error: ${JSON.stringify(error)}`);
            // Send app back to get ip address/error state
            return onRecursiveError(recursive, zeroConfResponse, i);
        });
        response.on("abort", () => {
            console.log("Request is Aborted");
            return onRecursiveError(recursive, zeroConfResponse, i);
        });
    });
    request.on("finish", () => {
        console.log("Request is Finished");
    });
    request.on("abort", () => {
        console.log("Request is Aborted");
        // Send app back to get ip address/error state
        return onRecursiveError(recursive, zeroConfResponse, i);
    });
    request.on("error", (error) => {
        console.log(`Request error: ${JSON.stringify(error)}`);
        // Send app back to get ip address/error state
        return onRecursiveError(recursive, zeroConfResponse, i);
    });
    request.on("close", () => {
        console.log("Last Transaction has occurred");
    });
    request.end();
}

module.exports = { isThisSentry, isThisSentryRecursive };

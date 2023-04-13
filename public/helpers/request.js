const { net } = require("electron");
const { loadSentry } = require("./loadSentry");
const { getMainWindow } = require("./appStart");
const {
    channels,
    TEST_SERVER_URL,
    SENTRY_RESPONSE,
} = require("../../src/shared/constants");
// const { SENTRY_SERVER_URL } = require("../../src/shared/constants");

function onError() {
    const mainWindow = getMainWindow();

    mainWindow.webContents.send(channels.APP_STATE, "error");
}

function request(ipaddress) {
    const data = [];
    const request = net.request(TEST_SERVER_URL);
    request.on("response", (response) => {
        console.log(`STATUS: ${response.statusCode}`);
        if (response.statusCode !== 200) {
            // Send app back to get ip address/error state
            onError();
        }
        response.on("data", (chunk) => {
            data.push(chunk);
        });
        response.on("end", () => {
            const dataString = Buffer.concat(data).toString();
            if (dataString === SENTRY_RESPONSE) {
                loadSentry(ipaddress);
            } else {
                // Send app back to get ip address/error state
                onError();
            }
        });
        response.on("error", (error) => {
            console.log(`Response error: ${JSON.stringify(error)}`);
            // Send app back to get ip address/error state
            onError();
        });
        response.on("abort", () => {
            console.log("Request is Aborted");
        });
    });
    request.on("finish", () => {
        console.log("Request is Finished");
    });
    request.on("abort", () => {
        console.log("Request is Aborted");
        // Send app back to get ip address/error state
        onError();
    });
    request.on("error", (error) => {
        console.log(`Request error: ${JSON.stringify(error)}`);
        // Send app back to get ip address/error state
        onError();
    });
    request.on("close", () => {
        console.log("Last Transaction has occurred");
    });
    request.end();
}

module.exports = { request };

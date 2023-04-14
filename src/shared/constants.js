const regEx = new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);
const TEST_SERVER_URL = "http://localhost:8080/isthissentry";
const SENTRY_SERVER_URL = "";
const SENTRY_RESPONSE = "iamsentry";

module.exports = {
    channels: {
        SEND_IP: "send-ip",
        APP_STATE: "app_state",
        MINIMIZE: "app-minimize",
        MAXIMIZE: "app-maximize",
        CLOSE: "app-close",
        SET_FULLSCREEN: "app-set-fullscreen",
        AUTO_CONNECT: "auto-connect",
    },
    regEx,
    TEST_SERVER_URL,
    SENTRY_SERVER_URL,
    SENTRY_RESPONSE,
};

const regEx = new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);

module.exports = {
    appStates: {
        ERROR_STATE: "error",
        SELECT_IP_STATE: "select-ip",
        CONNECTING_STATE: "connecting",
        AUTO_CONNECTION_STATE: "auto-connection",
        CONNECTED: "connected",
    },
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
};

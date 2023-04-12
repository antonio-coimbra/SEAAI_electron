const regEx = new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);

module.exports = {
    channels: {
        APP_STATE: "app_state",
        MINIMIZE: "app-minimize",
        MAXIMIZE: "app-maximize",
        CLOSE: "app-close",
        SET_FULLSCREEN: "app-set-fullscreen",
    },
    regEx,
};

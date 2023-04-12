const path = require("path");
const preloadScriptPath = path.join(__dirname, "../preload.js");
const iconPath = path.join(__dirname, "./favion.ico");

const TITLE_BAR_HEIGHT = 35;

function setViewBounds(window, view) {
    const bounds = window.getContentBounds();

    view.setBounds({
        x: 0,
        y: TITLE_BAR_HEIGHT,
        width: bounds.width,
        height: bounds.height - TITLE_BAR_HEIGHT,
    });
}

module.exports = {
    preloadScriptPath,
    iconPath,
    setViewBounds,
};

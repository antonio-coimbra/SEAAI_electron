const Store = require("electron-store");
const storage = new Store();

const WINDOW_BOUNDS = "window-bounds";
const WAS_MAXIMIZED = "was-maximized";
const LAST_IP = "last-ip";

function getWindowSavedBounds() {
    const defaultBounds = [1800, 850];
    // When is the first time starting the app,
    // or there's no storage

    const bounds = storage.get(WINDOW_BOUNDS);
    if (bounds) return bounds;
    else {
        storage.set(WINDOW_BOUNDS, defaultBounds);
        return defaultBounds;
    }
}

function getWasMaximized() {
    const wasMaximized = storage.get(WAS_MAXIMIZED);
    if (wasMaximized) return true;
    else {
        storage.set(WAS_MAXIMIZED, false);
        return false;
    }
}

function getLastIP() {
    const lastIP = storage.get(LAST_IP);
    console.log("Saved IP: " + lastIP);
    if (lastIP) return lastIP;
    else {
        return "";
    }
}

function saveLastIP(ip) {
    console.log(`saving last ip to ${ip}`);
    storage.set(LAST_IP, ip);
}

function saveWindowBounds(bounds) {
    storage.set(WINDOW_BOUNDS, bounds);
}

function setWasMaximized(wasMaximized) {
    storage.set(WAS_MAXIMIZED, wasMaximized);
}

module.exports = {
    getWindowSavedBounds,
    saveWindowBounds,
    getWasMaximized,
    setWasMaximized,
    getLastIP,
    saveLastIP,
};

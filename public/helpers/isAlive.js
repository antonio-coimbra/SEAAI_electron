const fetch = require("electron-fetch").default;

async function isAlive(addresses) {
    try {
        let response = await fetch("http://" + ip);
        return response.ok;
    } catch (error) {
        return false;
    }
}

module.exports = { isAlive };

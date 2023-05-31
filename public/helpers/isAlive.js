const fetch = require("electron-fetch").default;

async function isAlive(ip) {
    try {
        let response = await fetch("http://" + ip);
        return response.ok;
    } catch (error) {
        // console.log(error);
        return false;
    }
}

module.exports = { isAlive };

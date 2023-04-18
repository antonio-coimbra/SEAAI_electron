const { isThisSentryRecursive } = require("./isThisSentry");
const { recursiveLoadSentry } = require("./loadSentry");
const mdns = require("multicast-dns")();

function recursiveIPCheck(response, i) {
    if (i < response.answers.length) {
        if (response.answers[i].name.includes("oscar.local") && response) {
            let ipFromZeroConf = response
                ? response.answers[i]
                    ? response.answers[i].data
                    : null
                : null;
            console.log("zeroconf:");
            console.log(ipFromZeroConf);
            return isThisSentryRecursive(
                ipFromZeroConf,
                recursiveLoadSentry,
                i,
                response,
                recursiveIPCheck
            );
        } else return null;
    } else return null;
}

function zeroconf() {
    mdns.on("response", function (response) {
        mdns.destroy(); // closes the socket
        let i = 0;
        let res = recursiveIPCheck(response, i);
        console.log(`recursiveIPCheck result: ${res}`);
        if (res === null) {
            console.log(`recursiveIPCheck FAILED`);
            // go to error page and manual ip insertion
        }
    });

    mdns.query({
        questions: [
            {
                name: "oscar.local",
                type: "A",
            },
        ],
    });
}

module.exports = { zeroconf };

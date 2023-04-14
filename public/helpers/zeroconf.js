const { loadSentry } = require("./loadSentry");
const mdns = require("multicast-dns")();

function zeroconf() {
    mdns.on("response", function (response) {
        const ipFromZeroConf = response
            ? response.answers[3]
                ? response.answers[3].data
                : null
            : null;
        console.log(`ip from zeroconf: ${ipFromZeroConf}`);
        if (ipFromZeroConf) loadSentry(ipFromZeroConf);
        return;
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

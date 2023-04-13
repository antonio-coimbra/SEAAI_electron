const { net } = require("electron");
const {
  TEST_SERVER_URL,
  SENTRY_RESPONSE,
} = require("../../src/shared/constants");
// const { SENTRY_SERVER_URL } = require("../../src/shared/constants");

function request(ipaddress, onSuccess, onError) {
  const data = [];
  const request = net.request(TEST_SERVER_URL);
  request.on("response", (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    if (response.statusCode !== 200) {
      // Send app back to get ip address state
      onError();
      // return;
    }
    response.on("data", (chunk) => {
      data.push(chunk);
    });
    response.on("end", () => {
      const dataString = Buffer.concat(data).toString();
      if (dataString === SENTRY_RESPONSE) {
        onSuccess(ipaddress);
      } else {
        // Send app back to get ip address state
        onError();
        // return;
      }
    });
    response.on("error", (error) => {
      console.log(`Response error: ${JSON.stringify(error)}`);
      // Send app back to get ip address state
      onError();
      // return;
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
    // Send app back to get ip address state
    onError();
    // return;
  });
  request.on("error", (error) => {
    console.log(`Request error: ${JSON.stringify(error)}`);
    // Send app back to get ip address state
    onError();
    // return;
  });
  request.on("close", () => {
    console.log("Last Transaction has occurred");
  });
  request.end();
}

module.exports = { request };

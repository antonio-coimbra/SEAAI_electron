const { net } = require("electron");
const { SENTRY_RESPONSE } = require("../../src/shared/constants");

function request(url, value, onSuccess) {
  const data = [];
  const request = net.request(url);
  request.on("response", (response) => {
    response.on("data", (chunk) => {
      data.push(chunk);
    })
    response.on("end", () => {
      const dataString = Buffer.concat(data).toString();
      console.log(dataString);
      console.log(SENTRY_RESPONSE);
      if (dataString === SENTRY_RESPONSE) {
        console.log("onSuccess")
        console.log(value)
        onSuccess(value);
      }
    })
    response.on("error", (error) => {
      console.log(`ERROR: ${JSON.stringify(error)}`)
    });
    response.on("abort", () => {
      console.log('Request is Aborted')
    })
  });
request.on('finish', () => {
    console.log('Request is Finished')
});
request.on('abort', () => {
    console.log('Request is Aborted')
});
request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`)
});
request.on('close', (error) => {
    console.log('Last Transaction has occurred')
});
request.end();
}

module.exports = { request };

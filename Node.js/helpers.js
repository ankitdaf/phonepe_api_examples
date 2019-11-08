const crypto = require("crypto");
const https = require("https");

function encodeRequest(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function signRequest(payload) {
  return crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");
}

function request(options, payload) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    req.on("error", reject);

    if (payload) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}

module.exports = {
  encodeRequest,
  signRequest,
  request
};

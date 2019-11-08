const crypto = require("crypto");

function encodeRequest(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function signRequest(payload) {
  return crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");
}

module.exports = {
  encodeRequest,
  signRequest
};

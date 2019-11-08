const endpoints = require("./endpoints");
const { encodeRequest, signRequest, request } = require("./helpers");

const CHARGE_ENDPOINT = "/v3/charge";
const QRINIT_ENDPOINT = "/v3/qr/init";
const TRANSACTION_ENDPOINT = "/v3/transaction";
const REFUND_ENDPOINT = "/v3/credit/backToSource";

class Client {
  constructor(config) {
    this.env = config.env || "UAT";
    this.merchantId = config.merchantId || "unknown-merchant";
    this.storeId = config.storeId || "unknown-store";
    this.terminalId = config.terminalId || "unknown-terminal";
    this.apiKeys = config.apiKeys;

    if (!this.apiKeys) {
      throw new Error("API keys missing");
    }
  }

  charge(amount, transaction_id, mobile_number, apiKeyIndex) {
    const payload = {
      amount: amount, // Amount in paise
      expiresIn: 180,
      instrumentReference: mobile_number,
      instrumentType: "MOBILE",
      merchantId: this.merchantId,
      merchantOrderId: transaction_id,
      storeId: this.storeId,
      terminalId: this.terminalId,
      transactionId: transaction_id,
      message: "Payment for " + transaction_id
    };

    const base64 = encodeRequest(payload);
    const sign = base64 + CHARGE_ENDPOINT + this.apiKeys[apiKeyIndex];
    const X_VERIFY = signRequest(sign) + "###" + apiKeyIndex;

    return request(
      {
        method: "POST",
        hostname: endpoints[this.env],
        path: CHARGE_ENDPOINT,
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": X_VERIFY
        }
      },
      { request: base64 }
    );
  }

  qrcode(amount, transaction_id, apiKeyIndex) {
    const payload = {
      amount: amount, // Amount in paise
      expiresIn: 180,
      merchantId: this.merchantId,
      merchantOrderId: transaction_id,
      storeId: this.storeId,
      terminalId: this.terminalId,
      transactionId: transaction_id,
      message: "Payment for " + transaction_id
    };

    const base64 = make_base64(payload);
    const sign = base64 + QRINIT_ENDPOINT + this.apiKeys[apiKeyIndex];
    const X_VERIFY = make_hash(sign) + "###" + apiKeyIndex;

    return request(
      {
        method: "POST",
        hostname: endpoints[this.env],
        path: QRINIT_ENDPOINT,
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": X_VERIFY
        }
      },
      { request: base64 }
    );
  }

  status(transactionId, apiKeyIndex) {
    const endpoint =
      TRANSACTION_ENDPOINT +
      "/" +
      this.merchantId +
      "/" +
      transactionId +
      "/status";
    const sign = endpoint + this.apiKeys[apiKeyIndex];
    const X_VERIFY = make_hash(sign) + "###" + apiKeyIndex;

    return request({
      method: "GET",
      hostname: endpoints[this.env],
      path: endpoint,
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
      }
    });
  }

  cancel(transactionId, apiKeyIndex) {
    const endpoint =
      CHARGE_ENDPOINT + "/" + this.merchantId + "/" + transactionId + "/cancel";
    const sign = endpoint + this.apiKeys[apiKeyIndex];
    const X_VERIFY = make_hash(sign) + "###" + apiKeyIndex;

    return request({
      method: "POST",
      hostname: endpoints[this.env],
      path: endpoint,
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
      }
    });
  }

  refund(transaction_id, provider_reference_id, apiKeyIndex) {
    const payload = {
      amount: 100,
      merchantId: this.merchantId,
      providerReferenceId: provider_reference_id,
      transactionId: transaction_id + "_refund",
      message: "Refund"
    };

    const base64 = make_base64(payload);
    const sign = base64 + REFUND_ENDPOINT + this.apiKeys[apiKeyIndex];
    const X_VERIFY = make_hash(sign) + "###" + apiKeyIndex;

    return request(
      {
        method: "POST",
        hostname: endpoints[this.env],
        path: REFUND_ENDPOINT,
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": X_VERIFY
        }
      },
      { request: base64_payload }
    );
  }
}

module.exports = Client;

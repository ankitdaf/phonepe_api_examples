const endpoints = require("./endpoints");
const { encodeRequest, signRequest } = require("./helpers");

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

  charge(amount, transaction_id, mobile_number, salt_key_index) {
    const BASE_URL = endpoints[this.env];
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

    const base64_payload = encodeRequest(payload);
    const verification =
      base64_payload + CHARGE_ENDPOINT + this.apiKeys[salt_key_index];
    const X_VERIFY = signRequest(verification) + "###" + salt_key_index;

    const url = BASE_URL + CHARGE_ENDPOINT;
    const data = { request: base64_payload };
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": X_VERIFY
    };

    const response = requests.request(
      "POST",
      url,
      (data = data),
      (headers = headers)
    );
    console.log(response.status_code, response.text);
    return response;
  }

  qrcode(amount, transaction_id, salt_key_index) {
    const BASE_URL = endpoints[this.env];
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

    const base64_payload = make_base64(payload);
    const verification_str =
      base64_payload + QRINIT_ENDPOINT + this.apiKeys[salt_key_index];
    const X_VERIFY = make_hash(verification_str) + "###" + salt_key_index;

    const url = BASE_URL + QRINIT_ENDPOINT;
    const data = make_request_body(base64_payload);
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": X_VERIFY
    };

    const response = requests.request(
      "POST",
      url,
      (data = data),
      (headers = headers)
    );
    console.log(response.status_code, response.text);
    return response;
  }

  status(transaction_id, salt_key_index) {
    const BASE_URL = endpoints[this.env];
    const endpoint =
      TRANSACTION_ENDPOINT +
      "/" +
      this.merchantId +
      "/" +
      transaction_id +
      "/status";
    const verification_str = endpoint + this.apiKeys[salt_key_index];
    const X_VERIFY = make_hash(verification_str) + "###" + salt_key_index;

    const url = BASE_URL + endpoint;
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": X_VERIFY
    };

    const response = requests.request("GET", url, (headers = headers));
    console.log(response.status_code, response.text);
    return response;
  }

  cancel(transaction_id, salt_key_index) {
    const BASE_URL = endpoints[this.env];
    const endpoint =
      CHARGE_ENDPOINT +
      "/" +
      this.merchantId +
      "/" +
      transaction_id +
      "/cancel";
    const verification_str = endpoint + this.apiKeys[salt_key_index];
    const X_VERIFY = make_hash(verification_str) + "###" + salt_key_index;

    const url = BASE_URL + endpoint;
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": X_VERIFY
    };

    const response = requests.request("POST", url, (headers = headers));
    console.log(response.status_code, response.text);
    return response;
  }

  refund(transaction_id, provider_reference_id, salt_key_index) {
    const BASE_URL = endpoints[this.env];
    const payload = {
      amount: 100,
      merchantId: this.merchantId,
      providerReferenceId: provider_reference_id,
      transactionId: transaction_id + "_refund",
      message: "Refund"
    };

    const base64_payload = make_base64(payload);
    const verification_str =
      base64_payload + REFUND_ENDPOINT + this.apiKeys[salt_key_index];
    const X_VERIFY = make_hash(verification_str) + "###" + salt_key_index;

    const url = BASE_URL + REFUND_ENDPOINT;
    const data = make_request_body(base64_payload);
    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": X_VERIFY
    };

    const response = requests.request(
      "POST",
      url,
      (data = data),
      (headers = headers)
    );
    console.log(response.status_code, response.text);
    return response;
  }
}

module.exports = Client;

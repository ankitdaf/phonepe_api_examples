const Client = require("./");

/*
 * Get the UAT credentials:
 * https://developer.phonepe.com/docs/test-credentials
 *
 * Get the production credentials:
 * https://developer.phonepe.com/docs/merchant-onboarding
 *
 */

const api = new Client({
  env: "UAT",
  merchantId: "Merchantid",
  storeId: "test_store",
  terminalId: "test_terminal",
  apiKeys: {
    "1": "key1",
    "2": "key2"
  }
});

const mobile = "1234567890";
const apiKeyIndex = "1";
const new_transaction_id = "#" + Date.now();

// Run these one by one as they are async calls.

api
  .qrcode(100, new_transaction_id, apiKeyIndex)
  .then(console.log, console.error);

api.charge(100, new_transaction_id, mobile, apiKeyIndex).then(res => {
  console.log(res);
  if (res.success) {
    console.log("providerReferenceId", res.data.providerReferenceId);
  }
}, console.error);

api.status(new_transaction_id, apiKeyIndex).then(console.log, console.error);

api.cancel(new_transaction_id, apiKeyIndex).then(console.log, console.error);

api
  .refund(new_transaction_id, providerReferenceId, apiKeyIndex)
  .then(console.log, console.error);

api.status(new_transaction_id, apiKeyIndex).then(console.log, console.error);

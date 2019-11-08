const { encodeRequest, signRequest } = require("./helpers");

const test_payload = {
  merchantId: "DemoMerchant",
  transactionId: "TX123456789",
  merchantOrderId: "M123456789",
  amount: 100,
  instrumentType: "MOBILE",
  instrumentReference: "9xxxxxxxxxx",
  message: "collect for XXX order",
  email: "amitxxx75@gmail.com",
  expiresIn: 180,
  shortName: "DemoCustomer",
  subMerchant: "DemoMerchant",
  storeId: "store1",
  terminalId: "terminal1"
};

const payload_base64 = encodeRequest(test_payload);
const X_VERIFY = signRequest(payload_base64 + "/v3/charge" + "key1");

console.log(
  "base64 request string should be correct:",
  payload_base64 ===
    "eyJtZXJjaGFudElkIjoiRGVtb01lcmNoYW50IiwidHJhbnNhY3Rpb25JZCI6IlRYMTIzNDU2Nzg5IiwibWVyY2hhbnRPcmRlcklkIjoiTTEyMzQ1Njc4OSIsImFtb3VudCI6MTAwLCJpbnN0cnVtZW50VHlwZSI6Ik1PQklMRSIsImluc3RydW1lbnRSZWZlcmVuY2UiOiI5eHh4eHh4eHh4eCIsIm1lc3NhZ2UiOiJjb2xsZWN0IGZvciBYWFggb3JkZXIiLCJlbWFpbCI6ImFtaXR4eHg3NUBnbWFpbC5jb20iLCJleHBpcmVzSW4iOjE4MCwic2hvcnROYW1lIjoiRGVtb0N1c3RvbWVyIiwic3ViTWVyY2hhbnQiOiJEZW1vTWVyY2hhbnQiLCJzdG9yZUlkIjoic3RvcmUxIiwidGVybWluYWxJZCI6InRlcm1pbmFsMSJ9"
);
console.log(
  "signed hash string should be correct:",
  X_VERIFY ===
    "5ec3e919ccb0d838d3f589b683b022d821cf4c2764655f7799f68f58d722570c"
);

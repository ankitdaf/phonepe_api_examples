import hashlib
import base64
import json

test_payload = {
    "merchantId": "DemoMerchant",
    "transactionId": "TX123456789",
    "merchantOrderId": "M123456789",
    "amount": 100,
    "instrumentType": "MOBILE",
    "instrumentReference": "9xxxxxxxxxx",
    "message": "collect for XXX order",
    "email": "amitxxx75@gmail.com",
    "expiresIn": 180,
    "shortName": "DemoCustomer",
    "subMerchant": "DemoMerchant",
    "storeId": "store1",
    "terminalId": "terminal1"
}
request = json.dumps(test_payload, separators=(',', ':')) # compact encoding
base64_payload = base64.urlsafe_b64encode(
    bytes(request, "utf-8")).decode("utf-8")

VERIFICATION_HASH = base64_payload + "/v3/charge" + 'key1'
m = hashlib.sha256()
m.update(VERIFICATION_HASH.encode())
X_VERIFY_STRING = m.hexdigest()

print(base64_payload)
# should be
# eyJtZXJjaGFudElkIjoiRGVtb01lcmNoYW50IiwidHJhbnNhY3Rpb25JZCI6IlRYMTIzNDU2Nzg5IiwibWVyY2hhbnRPcmRlcklkIjoiTTEyMzQ1Njc4OSIsImFtb3VudCI6MTAwLCJpbnN0cnVtZW50VHlwZSI6Ik1PQklMRSIsImluc3RydW1lbnRSZWZlcmVuY2UiOiI5eHh4eHh4eHh4eCIsIm1lc3NhZ2UiOiJjb2xsZWN0IGZvciBYWFggb3JkZXIiLCJlbWFpbCI6ImFtaXR4eHg3NUBnbWFpbC5jb20iLCJleHBpcmVzSW4iOjE4MCwic2hvcnROYW1lIjoiRGVtb0N1c3RvbWVyIiwic3ViTWVyY2hhbnQiOiJEZW1vTWVyY2hhbnQiLCJzdG9yZUlkIjoic3RvcmUxIiwidGVybWluYWxJZCI6InRlcm1pbmFsMSJ9

print(X_VERIFY_STRING)
# should be 
# 5ec3e919ccb0d838d3f589b683b022d821cf4c2764655f7799f68f58d722570c

import requests
import hashlib
import base64
import json
import phonepe_constants

MERCHANT_ID = ''
STORE_ID = ''
TERMINAL_ID = ''

API_KEYS = {}

CHARGE_ENDPOINT = "/v3/charge"
TRANSACTION_ENDPOINT = "/v3/transaction"
REFUND_ENDPOINT = "/v3/credit/backToSource"

def set_environment(ENV):
    global BASE_URL
    BASE_URL = phonepe_constants.URLS[ENV]

def make_charge_request(amount,transaction_id, mobile_number, salt_key_index):
    request_payload = {
    	"amount": amount, # Amount in paise
    	"expiresIn": 180,
    	"instrumentReference" : mobile_number,
    	"instrumentType": "MOBILE",
        "merchantId": MERCHANT_ID,
        "merchantOrderId":transaction_id,
        "storeId":STORE_ID,
        "terminalId": TERMINAL_ID,
        "transactionId": transaction_id
    }
    request = json.dumps(request_payload).replace(' ','').replace("'", '"')
    base64_payload = base64.urlsafe_b64encode(bytes(request, "utf-8")).decode("utf-8")
    request_body = {
        "request": base64_payload
    }
    VERIFICATION_HASH = base64_payload+CHARGE_ENDPOINT+API_KEYS[salt_key_index]
    m = hashlib.sha256()
    m.update(VERIFICATION_HASH.encode())
    X_VERIFY_STRING = m.hexdigest()+"###"+salt_key_index
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY_STRING
    }
    data_json=json.dumps(request_body)
    url = BASE_URL + CHARGE_ENDPOINT
    print(url)
    print("Headers: " + str(headers))
    print("Request body: " + request)
    response = requests.request("POST", url, data=data_json,headers=headers)
    print(response.status_code, response.text)
    return response


def make_status_request(transaction_id,salt_key_index):
    endpoint=TRANSACTION_ENDPOINT+"/"+MERCHANT_ID+"/"+transaction_id+"/status"
    url=BASE_URL+endpoint
    VERIFICATION_HASH = endpoint+API_KEYS[salt_key_index]
    m = hashlib.sha256()
    m.update(VERIFICATION_HASH.encode())
    X_VERIFY_STRING = m.hexdigest()+"###"+salt_key_index
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY_STRING
    }
    print(url)
    print("Headers: " + str(headers))
    response = requests.request("GET", url,headers=headers)
    print(response.status_code, response.text)
    return response

def make_cancel_request(transaction_id,salt_key_index):
    endpoint=CHARGE_ENDPOINT+"/"+MERCHANT_ID+"/"+transaction_id+"/cancel"
    url=BASE_URL+endpoint
    VERIFICATION_HASH = endpoint+API_KEYS[salt_key_index]
    m = hashlib.sha256()
    m.update(VERIFICATION_HASH.encode())
    X_VERIFY_STRING = m.hexdigest()+"###"+salt_key_index
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY_STRING
    }
    print(url)
    print("Headers: " + str(headers))
    response = requests.request("POST", url,headers=headers)
    print(response.status_code, response.text)
    return response

def make_refund_request(transaction_id,provider_reference_id,salt_key_index):
    request_payload = {
    	"amount": 100,
        "merchantId": MERCHANT_ID,
        "providerReferenceId":provider_reference_id,
        "transactionId": transaction_id+"_refund",
        "message":"Refund"
    }
    request = json.dumps(request_payload).replace(' ','').replace("'", '"')
    base64_payload = base64.urlsafe_b64encode(bytes(request, "utf-8")).decode("utf-8")
    request_body = {
        "request": base64_payload
    }
    VERIFICATION_HASH = base64_payload+REFUND_ENDPOINT+API_KEYS[salt_key_index]
    m = hashlib.sha256()
    m.update(VERIFICATION_HASH.encode())
    X_VERIFY_STRING = m.hexdigest()+"###"+salt_key_index
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY_STRING
    }
    data_json=json.dumps(request_body)
    url = BASE_URL + REFUND_ENDPOINT
    print(url)
    print("Headers: " + str(headers))
    print("Request body:" + request)
    response = requests.request("POST", url, data=data_json,headers=headers)
    print(response.status_code, response.text)
    return response
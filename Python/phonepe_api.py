import requests
import hashlib
import base64
import json
import phonepe_constants

MERCHANT_ID = ''
STORE_ID = ''
TERMINAL_ID = ''

API_KEYS = {}

QRINIT_ENDPOINT = "/v3/qr/init"
CHARGE_ENDPOINT = "/v3/charge"
TRANSACTION_ENDPOINT = "/v3/transaction"
REFUND_ENDPOINT = "/v3/credit/backToSource"


def set_environment(ENV):
    global BASE_URL
    BASE_URL = phonepe_constants.URLS[ENV]


def make_base64(json_obj):
    json_str = json.dumps(json_obj, separators=(',', ':'))  # compact encoding
    return base64.urlsafe_b64encode(bytes(json_str, "utf-8")).decode("utf-8")


def make_hash(input_str):
    m = hashlib.sha256()
    m.update(input_str.encode())
    return m.hexdigest()


def make_request_body(base64_payload):
    request_body = {
        "request": base64_payload
    }
    data_json = json.dumps(request_body)
    return data_json


def make_charge_request(amount, transaction_id, mobile_number, salt_key_index):
    request_payload = {
        "amount": amount,  # Amount in paise
        "expiresIn": 180,
        "instrumentReference": mobile_number,
        "instrumentType": "MOBILE",
        "merchantId": MERCHANT_ID,
        "merchantOrderId": transaction_id,
        "storeId": STORE_ID,
        "terminalId": TERMINAL_ID,
        "transactionId": transaction_id,
        "message": "Payment for " + transaction_id
    }

    base64_payload = make_base64(request_payload)
    verification_str = base64_payload + \
        CHARGE_ENDPOINT + API_KEYS[salt_key_index]
    X_VERIFY = make_hash(verification_str) + "###" + salt_key_index

    url = BASE_URL + CHARGE_ENDPOINT
    data = make_request_body(base64_payload)
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
    }

    response = requests.request("POST", url, data=data, headers=headers)
    print(response.status_code, response.text)
    return response


def make_qrinit_request(amount, transaction_id, salt_key_index):
    request_payload = {
        "amount": amount,  # Amount in paise
        "expiresIn": 180,
        "merchantId": MERCHANT_ID,
        "merchantOrderId": transaction_id,
        "storeId": STORE_ID,
        "terminalId": TERMINAL_ID,
        "transactionId": transaction_id,
        "message": "Payment for " + transaction_id
    }

    base64_payload = make_base64(request_payload)
    verification_str = base64_payload + \
        QRINIT_ENDPOINT + API_KEYS[salt_key_index]
    X_VERIFY = make_hash(verification_str) + "###" + salt_key_index

    url = BASE_URL + QRINIT_ENDPOINT
    data = make_request_body(base64_payload)
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
    }

    response = requests.request("POST", url, data=data, headers=headers)
    print(response.status_code, response.text)
    return response


def make_status_request(transaction_id, salt_key_index):
    endpoint = TRANSACTION_ENDPOINT + "/" + \
        MERCHANT_ID + "/" + transaction_id + "/status"
    verification_str = endpoint + API_KEYS[salt_key_index]
    X_VERIFY = make_hash(verification_str) + "###" + salt_key_index

    url = BASE_URL + endpoint
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
    }

    response = requests.request("GET", url, headers=headers)
    print(response.status_code, response.text)
    return response


def make_cancel_request(transaction_id, salt_key_index):
    endpoint = CHARGE_ENDPOINT + "/" + MERCHANT_ID + "/" + transaction_id + "/cancel"
    verification_str = endpoint + API_KEYS[salt_key_index]
    X_VERIFY = make_hash(verification_str) + "###" + salt_key_index

    url = BASE_URL + endpoint
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
    }

    response = requests.request("POST", url, headers=headers)
    print(response.status_code, response.text)
    return response


def make_refund_request(transaction_id, provider_reference_id, salt_key_index):
    request_payload = {
        "amount": 100,
        "merchantId": MERCHANT_ID,
        "providerReferenceId": provider_reference_id,
        "transactionId": transaction_id + "_refund",
        "message": "Refund"
    }

    base64_payload = make_base64(request_payload)
    verification_str = base64_payload + \
        REFUND_ENDPOINT + API_KEYS[salt_key_index]
    X_VERIFY = make_hash(verification_str) + "###" + salt_key_index

    url = BASE_URL + REFUND_ENDPOINT
    data = make_request_body(base64_payload)
    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": X_VERIFY
    }

    response = requests.request("POST", url, data=data, headers=headers)
    print(response.status_code, response.text)
    return response

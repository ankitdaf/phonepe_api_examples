import datetime
import json
import phonepe_api

env = 'UAT' # Choose the environment first between UAT / Production

phonepe_api.set_environment(env) # Possible values are UAT or PROD

""" Your credentials go here. 
You can get the UAT credentials from here : 
https://developer.phonepe.com/docs/test-credentials
You can get the production credentials by following the link below :
https://developer.phonepe.com/docs/merchant-onboarding
"""

phonepe_api.MERCHANT_ID = 'Merchantid'
phonepe_api.STORE_ID = 'test_store'
phonepe_api.TERMINAL_ID = 'test_terminal'

api_keys = {
    '1': 'key1',
    '2': 'key2'
}

phonepe_api.API_KEYS.update(api_keys)

customer_mobile_number = '1234567890'
salt_key_index = '1'
new_transaction_id = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # Setting the current date and time as orderId, for example

response = phonepe_api.make_qrinit_request(100, new_transaction_id, salt_key_index)
#response = phonepe_api.make_charge_request(100, new_transaction_id, customer_mobile_number, salt_key_index)
#response_content = json.loads(response.content)
#if response_content['success'] is True:
#    providerReferenceId = json.loads(response.content)['data']['providerReferenceId']

#response = phonepe_api.make_status_request(new_transaction_id, salt_key_index)

#response = phonepe_api.make_cancel_request(new_transaction_id,salt_key_index)
#response = phonepe_api.make_refund_request(new_transaction_id, providerReferenceId, salt_key_index)
#response = phonepe_api.make_status_request(new_transaction_id, salt_key_index)

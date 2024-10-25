lo_response = frappe.call('validate_document_fields', io_doc=doc)

if lo_response.get('message'):
    for l_message in lo_response['message']:
        if l_message['code'] != 200:
            frappe.throw(l_message['msg'])

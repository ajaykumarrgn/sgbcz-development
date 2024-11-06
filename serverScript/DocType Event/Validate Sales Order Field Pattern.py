lo_response = frappe.call('validate_document_fields', io_doc=doc)

error_messages=[]

if lo_response.get('message'):
    
    for l_message in lo_response['message']:
        if l_message['code'] != 200:
           error_messages.append(l_message['msg'])
    if len(error_messages) > 0:
        frappe.throw(
                title='Error',
                msg=error_messages,
                as_list=True
                )

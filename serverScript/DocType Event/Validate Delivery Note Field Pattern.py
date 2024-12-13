
def validate_serial_number_duplicate(serial_number, schedule, doc):
    if serial_number:
        duplicate = frappe.db.exists('Delivery Schedule', {'serial_number': serial_number, 'docstatus': 1})
        if duplicate:
            # Check if the serial number is present in other Delivery Note schedules
            count = frappe.db.count('Delivery Schedule', {'serial_number': serial_number, 'parent': ["!=", schedule.parent]})
            # If there is an entry raise error
            if count > 0:
                raise frappe.ValidationError('Duplicate Serial Number')
    
    # Check if the Serial number is present in schedule lines of current document
    count = sum(1 for schedule_item in doc.delivery_schedule if schedule_item.serial_number == serial_number)
    # If there are more than one entries then raise error
    if count > 1:
        raise frappe.ValidationError('Duplicate Serial Number')
            

lo_response = frappe.call('validate_document_fields', io_doc=doc)
 
la_error_messages=[]
 
if lo_response.get('message'):
    
    for l_message in lo_response['message']:
        if l_message['code'] != 200:
          la_error_messages.append(l_message['msg'])
    if len(la_error_messages) > 0:
        frappe.throw(
                title='Error',
                msg=la_error_messages,
                as_list=True
                )
    
for schedule in doc.delivery_schedule:
    # if schedule.invoice_number:
    #     frappe.call('validate_naming_pattern', prefix='781', length=9, field_value=schedule.invoice_number, field='Invoice Number')
    if schedule.serial_number:
        # frappe.call('validate_naming_pattern', prefix='70', length=7, field_value=schedule.serial_number, field='Serial Number')
        try:
            validate_serial_number_duplicate(schedule.serial_number, schedule, doc)
        except Exception as e:
            title = 'Serial Number:' +  schedule.serial_number,
            frappe.throw( title=title, msg=str(e))
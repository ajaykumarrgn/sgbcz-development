# def validate_sap_ref_pattern(input_string):
#     if input_string[9] == '/':
#         # Check if the last two characters are digits
#         if input_string[10:].isdigit():
#             # Convert the last two characters to an integer
#             last_two_digits = int(input_string[10:])
#             # Check if the last two digits are multiples of 10
#             if last_two_digits % 10 == 0:
#                 return True
#     raise frappe.ValidationError('SAP Reference Number Pattern Error')
# for item in doc.items:
#     if item.rdg_number:
#         frappe.call('validate_naming_pattern', prefix='RDG', length=11, field_value=item.rdg_number, field='RDG Number')
#     if item.sap_reference:
#         # Split the SAP Reference at / to the get the first part and validate its length and pattern
#         sap_reference = item.sap_reference.split('/')
#         frappe.call('validate_naming_pattern', prefix='742', length=9, field_value=sap_reference[0], field='SAP Reference' )
#         try:
#             validate_sap_ref_pattern(item.sap_reference) 
#         except Exception as e:
#             # Handle the exception and return an error response
#             frappe.log_error(str(e))  # Log the error for debugging purposes
#             frappe.response['message'] =  'Unsuccessful'
#             frappe.throw( title='SAP Reference', msg=str(e))

# def validate_sap_ref_pattern(input_string):
#     if input_string[9] == '/':
#         # Check if the last two characters are digits
#         if input_string[10:].isdigit():
#             # Convert the last two characters to an integer
#             last_two_digits = int(input_string[10:])
#             # Check if the last two digits are multiples of 10
#             if last_two_digits % 10 == 0:
#                 return True
#     raise frappe.ValidationError('SAP Reference Number Pattern Error')

def get_factory_naming_details(factory, parameter):
    # Fetch prefix, length, and other details from the child table of Factory Doctype
    naming_details = frappe.get_all('Factory Details', filters={'parent': factory, 'parameter': parameter}, fields=['prefix', 'length'])
    return naming_details

for item in doc.items:
    if item.rdg_number:
        # Fetch the naming pattern details from Factory child table dynamically
        naming_details = get_factory_naming_details(doc.factory, 'RDG Number')
        frappe.call('validate_naming_pattern', prefix=naming_details[0].prefix, length=naming_details[0].length, field_value=item.rdg_number, field='RDG Number')

    if item.sap_reference:
        # Fetch the naming pattern details from Factory child table dynamically
        naming_details = get_factory_naming_details(doc.factory, 'SAP Reference')
        # sap_reference = item.sap_reference.split('/')
        
        # Call the validation for SAP Reference
        frappe.call('validate_naming_pattern', prefix=naming_details[0].prefix, length=naming_details[0].length, field_value=item.sap_reference, field='SAP Reference')

        # Use dynamic pattern length for validation
        # try:
        #     validate_sap_ref_pattern(item.sap_reference)
        # except frappe.ValidationError as e:
        #     # Handle the exception and return an error response
        #     frappe.log_error(str(e))  # Log the error for debugging purposes
        #     frappe.response['message'] = 'Unsuccessful'
        #     frappe.throw(title='SAP Reference', msg=str(e))

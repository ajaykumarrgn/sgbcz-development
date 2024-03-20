field_value = frappe.form_dict.get('field_value')
field = frappe.form_dict.get('field')
prefix = frappe.form_dict.get('prefix')
length = frappe.form_dict.get('length')
try:
    # get the lenth of the prefix characters
    prefix_length = len(prefix)
    # # Check if the first prefix_length character equal the prefix value
    if not field_value[:prefix_length] == prefix:
        frappe.response['message'] =  'Unsuccessful'
        raise frappe.ValidationError("Pattern Prefix Validation Error")
    else:
        frappe.response['message'] =  'Successful'
    if not len(field_value) == length:
         raise frappe.ValidationError("Pattern Length Validation Error")

except Exception as e:
    # Handle the exception and return an error response
    frappe.log_error(str(e))  # Log the error for debugging purposes
    frappe.response['message'] =  'Unsuccessful'
    frappe.throw( title=field, msg=str(e))
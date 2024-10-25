lo_doc = frappe.form_dict.get('io_doc')  
 # Access the parent
l_parent = lo_doc.custom_factory  

def fn_validate_field_prefix(i_field_validation_rules, i_value, ia_response):
    # Validate the prefix of a given field value
    if i_value:
        if not i_value.startswith(i_field_validation_rules.prefix):
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Prefix Error ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_field_length(i_field_validation_rules, i_value, ia_response):
    # Validate the length of a given field value
    if i_value:
        if len(i_value) != i_field_validation_rules.length:
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Length Error ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })
            
def fn_validate_document_field(i_field_validation_rules, i_value):
    # Validate a field based on defined rules and return any errors
    la_response = []
    fn_validate_field_prefix(i_field_validation_rules, i_value, la_response)
    fn_validate_field_length(i_field_validation_rules, i_value, la_response)
    
    return la_response

# Fetch parent documents based on filters
la_field_validation_rules = frappe.get_all('Field Validation Rules', filters={
    'parent': l_parent,
    'doctype_name': lo_doc.doctype,
}, fields=["*"])

la_response = []  # Initialize response list to collect validation results

# Iterate through validation rules and apply them to the document fields
for l_field_validation_rules in la_field_validation_rules:
    if l_field_validation_rules.is_child:
        # If the field is a child, validate each child document
        for l_child in lo_doc.get(l_field_validation_rules.child_field_name):
            log(l_field_validation_rules.field_name)  # Log the field name being validated
            l_value = l_child.get(l_field_validation_rules.field_name)  # Get the field value from child
            la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  # Validate and collect errors
    else:
        # Validate a direct field in the main document
        l_value = lo_doc.get(l_field_validation_rules.field_name)   
        la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  # Validate and collect errors

# Check if there are any errors and append a success message if none found
if not la_response:
    la_response.append({
        "code": 200,
        "msg": 'Validation Successful',
        "msgtype": 'Success'
    })   

# Set the response and flags as an array for further processing
frappe.flags["message"] = la_response  # Store the response in frappe's flags for later use

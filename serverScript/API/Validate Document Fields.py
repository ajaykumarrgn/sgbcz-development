lo_doc = frappe.form_dict.get('io_doc')  
# Access the parent
l_parent = lo_doc.custom_factory  

# Function to convert field name to label
def fn_convert_fieldname_to_label(i_field_name):
    # Split the field name on underscores
    la_words = i_field_name.split('_')
    
    # Capitalize each word
    # Use str.title() which capitalizes the first letter of each word but preserves existing casing.
    return ' '.join(la_word.title() for la_word in la_words)

# Helper function to append error messages in a standardized way
def fn_add_error_message(ia_response, code, msg, field_name):
    field_label = fn_convert_fieldname_to_label(field_name)
    ia_response.append({
        "code": code,
        "msg": _(f"{msg} {field_label}"),
        "msgtype": "Error"
    })

# General field validation function
def fn_validate_field(i_field_validation_rules, i_value, ia_response):
    field_label = fn_convert_fieldname_to_label(i_field_validation_rules.field_name)

    # Perform various field checks (prefix, suffix, separator, length, and type)
    if i_value:
        # Validate prefix
        fn_validate_prefix(i_field_validation_rules, i_value, ia_response, field_label)

        # Validate suffix
        fn_validate_suffix(i_field_validation_rules, i_value, ia_response, field_label)

        # Validate separator
        fn_validate_separator(i_field_validation_rules, i_value, ia_response, field_label)

        # Validate field length and type based on whether separator exists
        if i_field_validation_rules.separator:
            fn_validate_with_separator(i_field_validation_rules, i_value, ia_response, field_label)
        else:
            fn_validate_length_and_type(i_field_validation_rules, i_value, ia_response, field_label)

# Validate prefix of the field
def fn_validate_prefix(i_field_validation_rules, i_value, ia_response, field_label):
    if i_field_validation_rules.prefix and not i_value.startswith(i_field_validation_rules.prefix):
        fn_add_error_message(ia_response, 301, "Pattern Prefix Error:", i_field_validation_rules.field_name)

# Validate suffix of the field
def fn_validate_suffix(i_field_validation_rules, i_value, ia_response, field_label):
    if i_field_validation_rules.suffix and not i_value.endswith(i_field_validation_rules.suffix):
        fn_add_error_message(ia_response, 301, "Pattern Suffix Error:", i_field_validation_rules.field_name)

# Validate separator in the field
def fn_validate_separator(i_field_validation_rules, i_value, ia_response, field_label):
    if i_field_validation_rules.separator and i_field_validation_rules.separator not in i_value:
        fn_add_error_message(ia_response, 301, "Separator Error:", i_field_validation_rules.field_name)

# Validate prefix length and type (for fields with separators)
def fn_validate_with_separator(i_field_validation_rules, i_value, ia_response, field_label):
    la_split = i_value.split(i_field_validation_rules.separator)

    # Validate prefix length
    if len(la_split) > 0 and i_field_validation_rules.part_1_length is not None:
        fn_validate_part_length(i_field_validation_rules.part_1_length, la_split[0], ia_response, 'Prefix', field_label)

    # Validate prefix type
    if len(la_split) > 0:
        fn_validate_part_type(i_field_validation_rules.part_1_type, la_split[0], ia_response, 'Prefix', field_label)

    # Validate suffix
    if len(la_split) > 1:
        suffix_value = la_split[1]
        fn_validate_suffix_length_and_type(i_field_validation_rules, suffix_value, ia_response, field_label)

        # Check if the suffix is divisible by the specified number
        if i_field_validation_rules.part_2_condition is not None:
            fn_validate_suffix_condition(i_field_validation_rules, suffix_value, ia_response, field_label)

# Validate prefix length
def fn_validate_part_length(i_length, part_value, ia_response, part_name, field_label):
    if len(part_value) != i_length:
        fn_add_error_message(ia_response, 301, f"{part_name} Length Error:", field_label)

# Validate prefix/suffix type (integer or alphanumeric)
def fn_validate_part_type(i_type, part_value, ia_response, part_name, field_label):
    if i_type == 'int' and not part_value.isdigit():
        fn_add_error_message(ia_response, 301, f"{part_name} Type Error:", field_label + " must be an integer.")
    elif i_type == 'data' and not part_value.isalnum():
        fn_add_error_message(ia_response, 301, f"{part_name} Type Error:", field_label + " must be alphanumeric.")

# Validate suffix length and type (skip length validation if part_2_length == 0)
def fn_validate_suffix_length_and_type(i_field_validation_rules, suffix_value, ia_response, field_label):
    # Skip suffix length validation if part_2_length is 0
    if i_field_validation_rules.part_2_length != 0:
        # Validate suffix length
        if i_field_validation_rules.part_2_length is not None and len(suffix_value) != i_field_validation_rules.part_2_length:
            fn_add_error_message(ia_response, 301, "Suffix Length Error:", field_label)

    # Validate suffix type
    fn_validate_part_type(i_field_validation_rules.part_2_type, suffix_value, ia_response, 'Suffix', field_label)

# Validate if the suffix meets the divisibility condition
def fn_validate_suffix_condition(i_field_validation_rules, suffix_value, ia_response, field_label):
    if suffix_value.isdigit():
        suffix_number = int(suffix_value)
        if suffix_number % i_field_validation_rules.part_2_condition != 0:
            fn_add_error_message(ia_response, 301, "Invalid SAP Reference Number:", field_label)

# Validate length and type for fields without separators
def fn_validate_length_and_type(i_field_validation_rules, i_value, ia_response, field_label):
    # Validate length
    if i_field_validation_rules.part_1_length is not None and len(i_value) != i_field_validation_rules.part_1_length:
        fn_add_error_message(ia_response, 301, "Pattern Length Error:", field_label)

    # Validate type (prefix type for entire value)
    fn_validate_part_type(i_field_validation_rules.part_1_type, i_value, ia_response, 'Prefix', field_label)

# Main function to validate the document fields
def fn_validate_document_field(i_field_validation_rules, i_value):
    ia_response = []
    fn_validate_field(i_field_validation_rules, i_value, ia_response)
    return ia_response

# Iterating through field validation rules and applying them
la_field_validation_rules = frappe.get_doc('Factory', l_parent).field_validation_rules

la_response = []  

for l_field_validation_rules in la_field_validation_rules:
    if l_field_validation_rules.is_child:
        for l_child in lo_doc.get(l_field_validation_rules.child_field_name) or []:
            log(l_field_validation_rules.field_name)  
            l_value = l_child.get(l_field_validation_rules.field_name)  
            la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  
    else:
        l_value = lo_doc.get(l_field_validation_rules.field_name)   
        la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  

# If no errors, append a success message
if not la_response:
    la_response.append({
        "code": 200,
        "msg": 'Validation Successful',
        "msgtype": 'Success'
    })

frappe.flags["message"] = la_response

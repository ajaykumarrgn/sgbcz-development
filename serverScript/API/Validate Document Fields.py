lo_doc = frappe.form_dict.get('io_doc')  
# Access the parent
l_parent = lo_doc.custom_factory  

def fn_convert_fieldname_to_label(i_field_name);
    
    return l_field_label

def fn_validate_field_prefix(i_field_validation_rules, i_value, ia_response):
    # Validate the prefix of a given field value
    if i_value:
        if not i_value.startswith(i_field_validation_rules.prefix):
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Prefix Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_field_suffix(i_field_validation_rules, i_value, ia_response):
    # Validate the suffix of a given field value if a suffix is defined
    if i_value and i_field_validation_rules.suffix:
        if not i_value.endswith(i_field_validation_rules.suffix):
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Suffix Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_field_separator(i_field_validation_rules, i_value, ia_response):
    # Validate that the field value contains the specified separator
    if i_value and i_field_validation_rules.separator:
        if i_field_validation_rules.separator not in i_value:
            ia_response.append({
                "code": 301,
                "msg": 'Separator Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_length(i_field_validation_rules, i_value, ia_response):
    # Check if i_value is provided
    if i_value:  
        # If a separator is defined
        if i_field_validation_rules.separator:
            la_split = i_value.split(i_field_validation_rules.separator)

            # Validate prefix length
            if len(la_split) > 0 and i_field_validation_rules.part_1_length is not None:
                prefix_value = la_split[0]
                if len(prefix_value) != i_field_validation_rules.part_1_length:
                    ia_response.append({
                        "code": 301,
                        "msg": 'Prefix Length Error: ' + i_field_validation_rules.field_name,
                        "msgtype": 'Error'
                    })

                # Check prefix type
                if i_field_validation_rules.part_1_type == 'int' and not prefix_value.isdigit():
                    ia_response.append({
                        "code": 301,
                        "msg": 'Prefix Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                        "msgtype": 'Error'
                    })
                elif i_field_validation_rules.part_1_type == 'data' and not prefix_value.isalnum():
                    ia_response.append({
                        "code": 301,
                        "msg": 'Prefix Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                        "msgtype": 'Error'
                    })

            # Check for suffix validation based on either length or divisibility
            if len(la_split) > 1:  # Ensure there is a suffix part
                suffix_value = la_split[1] 

                # If suffix_length is 0, only check for suffix type and divisibility
                if i_field_validation_rules.part_2_length == 0:
                    # Check suffix type
                    if i_field_validation_rules.part_2_type == 'int' and not suffix_value.isdigit():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Suffix Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                            "msgtype": 'Error'
                        })
                    elif i_field_validation_rules.part_2_type == 'data' and not suffix_value.isalnum():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Suffix Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                            "msgtype": 'Error'
                        })
                else:
                    # Validate suffix length if defined
                    if i_field_validation_rules.part_2_length is not None:
                        if len(suffix_value) != i_field_validation_rules.part_2_length:
                            ia_response.append({
                                "code": 301,
                                "msg": 'Suffix Length Error: ' + i_field_validation_rules.field_name,
                                "msgtype": 'Error'
                            })

                    # Check suffix type
                    if i_field_validation_rules.part_2_type == 'int' and not suffix_value.isdigit():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Suffix Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                            "msgtype": 'Error'
                        })
                    elif i_field_validation_rules.part_2_type == 'data' and not suffix_value.isalnum():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Suffix Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                            "msgtype": 'Error'
                        })

                # Validate if the suffix is divisible by the specified number
                if i_field_validation_rules.part_2_condition is not None:
                    if suffix_value.isdigit():  # Ensure suffix is a valid number
                        suffix_number = int(suffix_value)
                        if suffix_number % i_field_validation_rules.part_2_condition != 0:
                            ia_response.append({
                                "code": 301,
                                "msg": 'Invalid SAP Reference Number: ' + i_field_validation_rules.field_name,
                                "msgtype": 'Error'
                            })
        else:
            # If no separator is defined, validate the entire length of the value
            if i_field_validation_rules.part_1_length is not None:
                if len(i_value) != i_field_validation_rules.part_1_length:
                    ia_response.append({
                        "code": 301,
                        "msg": 'Pattern Length Error: ' + i_field_validation_rules.field_name,
                        "msgtype": 'Error'
                    })

            # Check prefix type for the whole value
            if i_field_validation_rules.part_1_type == 'int' and not i_value.isdigit():
                ia_response.append({
                    "code": 301,
                    "msg": 'Prefix Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                    "msgtype": 'Error'
                })
            elif i_field_validation_rules.part_1_type == 'data' and not i_value.isalnum():
                ia_response.append({
                    "code": 301,
                    "msg": 'Prefix Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                    "msgtype": 'Error'
                })


def fn_validate_document_field(i_field_validation_rules, i_value):
    # Validate a field based on defined rules and return any errors
    la_response = []
    fn_validate_field_prefix(i_field_validation_rules, i_value, la_response)
    fn_validate_field_suffix(i_field_validation_rules, i_value, la_response)  
    fn_validate_field_separator(i_field_validation_rules, i_value, la_response)
    fn_validate_length(i_field_validation_rules, i_value, la_response)
    
    return la_response


la_field_validation_rules = frappe.get_doc('Factory', l_parent).field_validation_rules

la_response = []  

# Iterate through validation rules and apply them to the document fields
for l_field_validation_rules in la_field_validation_rules:
    if l_field_validation_rules.is_child:
        # If the field is a child, validate each child document
        for l_child in lo_doc.get(l_field_validation_rules.child_field_name) or []:
            log(l_field_validation_rules.field_name)  
            l_value = l_child.get(l_field_validation_rules.field_name)  
            la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  
    else:
        # Validate a direct field in the main document
        l_value = lo_doc.get(l_field_validation_rules.field_name)   
        la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  

# Check if there are any errors and append a success message if none found
if not la_response:
    la_response.append({
        "code": 200,
        "msg": 'Validation Successful',
        "msgtype": 'Success'
    })   

frappe.flags["message"] = la_response 
lo_doc = frappe.form_dict.get('io_doc')  
# Access the parent
l_parent = lo_doc.custom_factory  

def fn_validate_field_prefix(i_field_validation_rules, i_value, ia_response):
    if i_value:
        if not i_value.startswith(i_field_validation_rules.prefix):
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Prefix Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_field_suffix(i_field_validation_rules, i_value, ia_response):
    if i_value and i_field_validation_rules.suffix:
        if not i_value.endswith(i_field_validation_rules.suffix):
            ia_response.append({
                "code": 301,
                "msg": 'Pattern Suffix Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_field_separator(i_field_validation_rules, i_value, ia_response):
    if i_value and i_field_validation_rules.separator:
        if i_field_validation_rules.separator not in i_value:
            ia_response.append({
                "code": 301,
                "msg": 'Separator Error: ' + i_field_validation_rules.field_name,
                "msgtype": 'Error'
            })

def fn_validate_length(i_field_validation_rules, i_value, ia_response):
    if i_value:  
        if i_field_validation_rules.separator:
            la_split = i_value.split(i_field_validation_rules.separator)

            # Validate part 1 length
            if len(la_split) > 0 and i_field_validation_rules.part_1_length is not None:
                part_1_value = la_split[0]
                if len(part_1_value) != i_field_validation_rules.part_1_length:
                    ia_response.append({
                        "code": 301,
                        "msg": 'Part 1 Length Error: ' + i_field_validation_rules.field_name,
                        "msgtype": 'Error'
                    })

                # Check part 1 type
                if i_field_validation_rules.part_1_type == 'int' and not part_1_value.isdigit():
                    ia_response.append({
                        "code": 301,
                        "msg": 'Part 1 Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                        "msgtype": 'Error'
                    })
                elif i_field_validation_rules.part_1_type == 'data' and not part_1_value.isalnum():
                    ia_response.append({
                        "code": 301,
                        "msg": 'Part 1 Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                        "msgtype": 'Error'
                    })

            # Check for suffix validation based on either length or divisibility
            if len(la_split) > 1:
                part_2_value = la_split[1]

                # If part_2_length is 0, only check for part 2 type and divisibility
                if i_field_validation_rules.part_2_length == 0:
                    if i_field_validation_rules.part_2_type == 'int' and not part_2_value.isdigit():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Part 2 Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                            "msgtype": 'Error'
                        })
                    elif i_field_validation_rules.part_2_type == 'data' and not part_2_value.isalnum():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Part 2 Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                            "msgtype": 'Error'
                        })

                    if (i_field_validation_rules.part_2_condition is not None and 
                        i_field_validation_rules.part_2_condition != 0):  # Check for zero
                        if part_2_value.isdigit():
                            part_2_number = int(part_2_value)
                            if part_2_number % i_field_validation_rules.part_2_condition != 0:
                                ia_response.append({
                                    "code": 301,
                                    "msg": 'Invalid SAP Reference Number: ' + i_field_validation_rules.field_name,
                                    "msgtype": 'Error'
                                })
                else:
                    # Validate part 2 length if defined
                    if i_field_validation_rules.part_2_length is not None:
                        if len(part_2_value) != i_field_validation_rules.part_2_length:
                            ia_response.append({
                                "code": 301,
                                "msg": 'Part 2 Length Error: ' + i_field_validation_rules.field_name,
                                "msgtype": 'Error'
                            })

                    # Check part 2 type
                    if i_field_validation_rules.part_2_type == 'int' and not part_2_value.isdigit():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Part 2 Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                            "msgtype": 'Error'
                        })
                    elif i_field_validation_rules.part_2_type == 'data' and not part_2_value.isalnum():
                        ia_response.append({
                            "code": 301,
                            "msg": 'Part 2 Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                            "msgtype": 'Error'
                        })

                    if (i_field_validation_rules.part_2_condition is not None and 
                        i_field_validation_rules.part_2_condition != 0):  # Check for zero
                        if part_2_value.isdigit():
                            part_2_number = int(part_2_value)
                            if part_2_number % i_field_validation_rules.part_2_condition != 0:
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

            # Check part 1 type for the whole value
            if i_field_validation_rules.part_1_type == 'int' and not i_value.isdigit():
                ia_response.append({
                    "code": 301,
                    "msg": 'Part 1 Type Error: ' + i_field_validation_rules.field_name + ' must be an integer.',
                    "msgtype": 'Error'
                })
            elif i_field_validation_rules.part_1_type == 'data' and not i_value.isalnum():
                ia_response.append({
                    "code": 301,
                    "msg": 'Part 1 Type Error: ' + i_field_validation_rules.field_name + ' must be alphanumeric.',
                    "msgtype": 'Error'
                })

def fn_validate_document_field(i_field_validation_rules, i_value):
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
        for l_child in lo_doc.get(l_field_validation_rules.child_field_name) or []:
            log(l_field_validation_rules.field_name)  
            l_value = l_child.get(l_field_validation_rules.field_name)  
            la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  
    else:
        l_value = lo_doc.get(l_field_validation_rules.field_name)   
        la_response.extend(fn_validate_document_field(l_field_validation_rules, l_value))  

if not la_response:
    la_response.append({
        "code": 200,
        "msg": 'Validation Successful',
        "msgtype": 'Success'
    })   

frappe.flags["message"] = la_response

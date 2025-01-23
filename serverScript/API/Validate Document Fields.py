# Get the document like sales order and delivery note
lo_doc = frappe.form_dict.get("io_doc")
# Get the factory field value for all factories
l_parent = lo_doc.custom_factory


# Convert the field name into the label name for displaying the error message
# Removes the underscore and ensures the first letter of each word is uppercase.
def fn_convert_fieldname_to_label(i_field_name):
    # Split the field name by underscores to extract individual words
    la_words = i_field_name.split("_")
    # Split the field name by underscores to extract individual words,
    # then capitalize the first letter of each word and join them with spaces,
    # resulting in a label-style name for display.
    return " ".join(la_word.title() for la_word in la_words)


# function adds error messages to the list of responses for all validation failures
def fn_add_error_message(
    ia_response, i_code, i_msg, field_name, i_additional_info=None
):
    # Call the function for converting the fieldname into the label name
    l_field_label = fn_convert_fieldname_to_label(field_name)

    # Include additional information in the error message
    # if it exists for the validation fields
    if i_additional_info:
        i_msg = f"{i_msg} {i_additional_info}"
    # Display the error message in the specified format
    # for all validation fields
    ia_response.append(
        {"code": i_code, "i_msg": _(f"{i_msg} - {l_field_label}"), "msgtype": "Error"}
    )


# Validate the field for prefix, suffix, length, and separator (if present)
# for validation fields like SAP reference, RDG number, invoice number, and serial number.
def fn_validate_field(i_field_validation_rules, i_value, ia_response):
    # Call the function for converting the fieldname into the label name
    l_field_label = fn_convert_fieldname_to_label(i_field_validation_rules.field_name)

    # Perform various field checks (prefix, suffix, separator, length, and type)
    # if a value is provided for the field
    if i_value:
        # Ensure the field value complies with the
        # specified prefix rule and log errors if invalid
        fn_validate_prefix_rule(
            i_field_validation_rules, i_value, ia_response, l_field_label
        )

        # Ensure the field value complies with the
        # specified suffix rule and log errors if invalid
        fn_validate_suffix_rule(
            i_field_validation_rules, i_value, ia_response, l_field_label
        )

        # Ensure the separator rule applies only to
        # the SAP reference field for all factories
        fn_validate_separator_rule(
            i_field_validation_rules, i_value, ia_response, l_field_label
        )

        # Validate the field length and type based on the presence of a separator.
        # For other fields such as RDG number, invoice number, and serial number,
        # skip the separator logic.
        if i_field_validation_rules.separator:
            fn_validate_with_separator_by_parts(
                i_field_validation_rules, i_value, ia_response, l_field_label
            )
        else:
            fn_validate_length_and_type(
                i_field_validation_rules, i_value, ia_response, l_field_label
            )


# Validate the prefix value for each factory (e.g., SGBCZ, RGB, NEU)
# as it can vary across factories
def fn_validate_prefix_rule(
    i_field_validation_rules, i_value, ia_response, l_field_label
):
    if i_field_validation_rules.prefix and not i_value.startswith(
        i_field_validation_rules.prefix
    ):
        l_expected_prefix = i_field_validation_rules.prefix
        # Check if the field value starts with the required prefix,
        # and display an error if it does not match
        fn_add_error_message(
            ia_response,
            301,
            "Prefix Error: The value should start with",
            i_field_validation_rules.field_name,
            l_expected_prefix,
        )


# Validate the suffix value for each factory such as SGBCZ, RGB, and NEU
# value on the each factory is different
def fn_validate_suffix_rule(
    i_field_validation_rules, i_value, ia_response, l_field_label
):
    if i_field_validation_rules.suffix and not i_value.endswith(
        i_field_validation_rules.suffix
    ):
        l_expected_suffix = i_field_validation_rules.suffix
        # Check if the field value starts with the required suffix,
        # and display an error if it does not match
        fn_add_error_message(
            ia_response,
            301,
            "Suffix Error: The value should end with",
            i_field_validation_rules.field_name,
            l_expected_suffix,
        )


# Validate the separator value for each factory, particularly for the SAP Reference field
# Ensure the separator value is acceptable and divisible by 10
def fn_validate_separator_rule(
    i_field_validation_rules, i_value, ia_response, l_field_label
):
    if (
        # Check if the separator is defined in the field validation rules and
        # if the separator is not present in the provided value
        i_field_validation_rules.separator
        and i_field_validation_rules.separator not in i_value
    ):
        # Store the error message for missing separator if configured.
        l_expected_separator = i_field_validation_rules.separator

        # Call a function to add an error message to the response
        # if the separator is missing
        fn_add_error_message(
            ia_response,
            301,
            "Separator Error: The value should contain the separator",
            i_field_validation_rules.field_name,
            l_expected_separator,
        )


# if separator there, it splitted into 2 parts with different length
# first part consider as prefix+length values of factory
# and second part consider as separator
def fn_validate_with_separator_by_parts(
    i_field_validation_rules, i_value, ia_response, l_field_label
):
    la_split = i_value.split(i_field_validation_rules.separator)

    # Validate the prefix length if it's specified in the rules
    if len(la_split) > 0 and i_field_validation_rules.part_1_length is not None:
        fn_validate_part_length(
            i_field_validation_rules.part_1_length,
            la_split[0],
            ia_response,
            "Prefix",
            l_field_label,
        )

    # Validate the prefix type if a prefix exists
    if len(la_split) > 0:
        fn_validate_part_type(
            i_field_validation_rules.part_1_type,
            la_split[0],
            ia_response,
            "Prefix",
            l_field_label,
        )

    # If a suffix exists (after the separator), validate its length and type
    if len(la_split) > 1:
        l_suffix_value = la_split[1]
        fn_validate_suffix_length_and_type(
            i_field_validation_rules, l_suffix_value, ia_response, l_field_label
        )

        # Check if the suffix is divisible by the specified number
        if i_field_validation_rules.part_2_condition is not None:
            fn_validate_suffix_condition(
                i_field_validation_rules, l_suffix_value, ia_response, l_field_label
            )


# Validate the length of each part (prefix or suffix) after splitting by the separator
def fn_validate_part_length(
    i_length, i_part_value, ia_response, i_part_name, l_field_label
):
    if len(i_part_value) != i_length:
        # Display error message if part length is incorrect
        fn_add_error_message(
            ia_response,
            301,
            f"{i_part_name} Length Error:",
            l_field_label,
            f"Should have {i_length} characters",
        )


# Validate the type (e.g., integer and data) of each part
def fn_validate_part_type(
    i_type, i_part_value, ia_response, i_part_name, l_field_label
):
    if i_type == "int" and not i_part_value.isdigit():
        # Display error message if the value is not an integer
        fn_add_error_message(
            ia_response,
            301,
            f"{i_part_name} Type Error:",
            l_field_label + " must be an integer.",
        )
    elif i_type == "data" and not i_part_value.isalnum():
        # Display error message if the value is not an alphanumeric
        fn_add_error_message(
            ia_response,
            301,
            f"{i_part_name} Type Error:",
            l_field_label + " must be alphanumeric.",
        )


# Validate the length of the value immediately come after separator(/)
def fn_validate_suffix_length_and_type(
    i_field_validation_rules, l_suffix_value, ia_response, l_field_label
):
    # Skip suffix length validation if part_2_length is 0
    if i_field_validation_rules.part_2_length != 0:
        # Check if part2 length is defined and
        # if the suffix length doesn't match the required length
        if (
            i_field_validation_rules.part_2_length is not None
            and len(l_suffix_value) != i_field_validation_rules.part_2_length
        ):
            # if length is not correct, it displays the error message
            fn_add_error_message(
                ia_response,
                301,
                "Suffix Length Error:",
                l_field_label,
                f"Should have {i_field_validation_rules.part_2_length} characters",
            )

    # Validate the type of the suffix value (e.g., int, data)
    fn_validate_part_type(
        i_field_validation_rules.part_2_type,
        l_suffix_value,
        ia_response,
        "Suffix",
        l_field_label,
    )


# Function to ensure the suffix value is divisible by a specific number (e.g., 10 or 20)
def fn_validate_suffix_condition(
    i_field_validation_rules, l_suffix_value, ia_response, l_field_label
):
    # Check if the suffix value is a valid number
    if l_suffix_value.isdigit():
        l_suffix_number = int(l_suffix_value)
        # Check if the suffix number is divisible by the specified condition (10 only)
        if l_suffix_number % i_field_validation_rules.part_2_condition != 0:
            # Display an error message when incorrect value is given
            fn_add_error_message(
                ia_response,
                301,
                "Invalid SAP Reference Number:",
                l_field_label,
                f"Should be divisible by {i_field_validation_rules.part_2_condition}",
            )


# Validate the length of the each field and also accept the field types as int and data
def fn_validate_length_and_type(
    i_field_validation_rules, i_value, ia_response, l_field_label
):
    # Validate the length of the field value
    # if part1 length is defined in the rules
    if (
        i_field_validation_rules.part_1_length is not None
        and len(i_value) != i_field_validation_rules.part_1_length
    ):
        # If the length doesn't match the expected length,
        # display an error message
        fn_add_error_message(
            ia_response,
            301,
            "Pattern Length Error:",
            l_field_label,
            f"Should have {i_field_validation_rules.part_1_length} characters",
        )

    # Validate the type of the value (e.g., whether it's an int and data.)
    fn_validate_part_type(
        i_field_validation_rules.part_1_type,
        i_value,
        ia_response,
        "Prefix",
        l_field_label,
    )


# Begin the execution
# by validating fields for each child table entry in the factory document
def fn_validate_document_field(i_field_validation_rules, i_value):
    ia_response = []
    fn_validate_field(i_field_validation_rules, i_value, ia_response)
    return ia_response


# Retrieve the field validation rules for the selected factory
la_field_validation_rules = frappe.get_doc("Factory", l_parent).field_validation_rules

la_response = []
# Get all the fields that are applied to the corresponding field validation rule.
for l_field_validation_rule in la_field_validation_rules:
    # Get the Details from the child table of the field validation rule
    if l_field_validation_rule.is_child:
        for l_child in lo_doc.get(l_field_validation_rule.child_field_name) or []:
            l_value = l_child.get(l_field_validation_rule.field_name)
            # Validate the field and add any response errors to the response list
            la_response.extend(
                fn_validate_document_field(l_field_validation_rule, l_value)
            )
    # Otherwise, get the field details directly from the factory doctype
    else:
        l_value = lo_doc.get(l_field_validation_rule.field_name)
        # Validate the field and add any response errors to the response list
        la_response.extend(fn_validate_document_field(l_field_validation_rule, l_value))

# If there are no validation errors, append a success message to the response list
if not la_response:
    la_response.append(
        {"code": 200, "i_msg": "Validation Successful", "msgtype": "Success"}
    )

frappe.flags["message"] = la_response
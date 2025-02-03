#ISS-2025-00021
#Submitted Delivery Note from Amended document is not getting  updated
def fn_validate_serial_number_duplicate(i_serial_number, i_schedule, doc):
    # Validate if the serial number exists in a confirmed Delivery Schedule
    if i_serial_number:
        # Check if the serial number exists in any other confirmed Delivery Schedules
        l_duplicate = frappe.db.exists(
            "Delivery Schedule", {"serial_number": i_serial_number, "docstatus": 1}
        )
        if l_duplicate:
            # Check if the serial number is found in other Delivery Schedules in submitted documents
            # (excluding the current schedule)
            l_count = frappe.db.count(
                "Delivery Schedule",
                {"serial_number": i_serial_number, "parent": ["!=", i_schedule.parent], "docstatus": 1}
            )
            # If there is an entry raise error
            if l_count > 0:
                raise frappe.ValidationError("Duplicate Serial Number")

    # Check if the Serial number is present in schedule lines of current document
    l_count = sum(
        1
        for schedule_item in doc.delivery_schedule
        if schedule_item.serial_number == i_serial_number
    )
    # If there are more than one entries then raise error
    if l_count > 1:
        raise frappe.ValidationError("Duplicate Serial Number")


# Call the API function as "validate_document_fields" for validating
# serial number and invoice number
lo_response = frappe.call("validate_document_fields", io_doc=doc)
la_error_messages = []
# Get all the reponse messages from the API and
# add the error message to the error message list
if lo_response.get("message"):
    for l_message in lo_response["message"]:
        # Add error messages to the list if they indicate failure.
        if l_message["code"] != 200:
            la_error_messages.append(l_message["i_msg"])

    # If there are error messages, throw an error with the list of messages
    if len(la_error_messages) > 0:
        frappe.throw(title="Error", msg=la_error_messages, as_list=True)


for i_schedule in doc.delivery_schedule:
    # if i_schedule.invoice_number:
    #     frappe.call('validate_naming_pattern', prefix='781', length=9, field_value=i_schedule.invoice_number, field='Invoice Number')
    if i_schedule.serial_number:
        # frappe.call('validate_naming_pattern', prefix='70', length=7, field_value=i_schedule.serial_number, field='Serial Number')
        try:
            fn_validate_serial_number_duplicate(i_schedule.serial_number, i_schedule, doc)
        except Exception as e:
            title = ("Serial Number:" + i_schedule.serial_number,)
            frappe.throw(title=title, msg=str(e))
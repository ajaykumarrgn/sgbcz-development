# Call the API function as "validate_document_fields" for validating
# SAP reference and RDG number
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
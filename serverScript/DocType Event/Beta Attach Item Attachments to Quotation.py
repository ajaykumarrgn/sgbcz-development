# Remove duplicate attachment from cancelled to amended quotation (ISS-2025-00051)
def fn_copy_file_from_item_to_quotation(im_item, im_doc, im_languages):
    # Changed Gitra Settings to Quotation presets for story >>US-2025-0603
    l_separator = frappe.db.get_value(
        "Quotation Presets", "Quotation Presets", "naming_separator"
    )

    def fn_get_language_pattern(im_languages, im_ext):
        # Generate language-specific file extensions
        # possibility- language come at start, middle or at end
        return {
            "start": [l_language + l_separator for l_language in im_languages],
            "end": [l_separator + l_language + im_ext for l_language in im_languages],
            "middle": [
                l_separator + l_language + l_separator for l_language in im_languages
            ],
        }

    # Get the attached files in the item
    la_file_list = frappe.get_all(
        "File",
        fields=[
            "file_name",
            "file_url",
            "folder",
            "file_size",
            "is_private",
            "content_hash",
        ],
        filters={
            "attached_to_doctype": im_item.doctype,
            "attached_to_name": im_item.name,
        },
        order_by="creation desc",
    )
    # get the possible pattern with customer language
    la_customer_language_patterns = fn_get_language_pattern([im_doc.language], ".pdf")
    # get the possible pattern for all the datasheet language
    la_all_patterns = fn_get_language_pattern(im_languages, ".pdf")
    # Check if the file name matches any of the patterns. Based on the key in the pattern,
    # it performs the search using Python's startswith, endswith, and 'in' for middle matching.

    # Args:
    # file_name : The name of the file to check.
    # patterns : The patterns for matching the file name.

    # Returns:
    # bool: True if any pattern matches the file name, False otherwise.
    def fn_matches_any_pattern(file_name, patterns):
        # Check if the file name matches any of the patterns
        return (
            any(file_name.startswith(pattern) for pattern in patterns["start"])
            or any(file_name.endswith(pattern) for pattern in patterns["end"])
            or any(pattern in file_name for pattern in patterns["middle"])
        )

    # Filter the attached files in the given item based on the customer print language
    la_print_language_records = [
        ld_record
        for ld_record in la_file_list
        if fn_matches_any_pattern(ld_record["file_name"], la_customer_language_patterns)
    ]
    # Filter the attached files without any of the language suffix patterns
    la_other_records = [
        ld_record
        for ld_record in la_file_list
        if not fn_matches_any_pattern(ld_record["file_name"], la_all_patterns)
    ]
    la_filtered_files = []
    la_filtered_files.extend(la_other_records)
    la_filtered_files.extend(la_print_language_records)
    for ld_file in la_filtered_files:
        # Create a new file object for the quotation
        lo_fileQuotation = frappe.get_doc(
            {
                "doctype": "File",
                "file_url": ld_file["file_url"],
                "file_name": ld_file["file_name"],
                "attached_to_doctype": im_doc.doctype,
                "attached_to_name": im_doc.name,
                "folder": ld_file["folder"],
                "file_size": ld_file["file_size"],
                "is_private": ld_file["is_private"],
                "content_hash": ld_file["content_hash"],
            }
        )
        lo_fileQuotation.flags.ignore_permissions = True
        try:
            # Insert the created file in the quotation
            lo_fileQuotation.insert()
        except frappe.DuplicateEntryError:
            ld_duplicate = frappe.get_doc("File", lo_fileQuotation.duplicate_entry)


# begin of execute
la_languages = []
# getting the datasheet languages from Quotation Presets
ld_gitra_settings = frappe.get_doc("Quotation Presets")
# Accessing the table multiselect field directly
ld_datasheet_languages = ld_gitra_settings.get("datasheet_languages")
# Initialize an empty list to store languages
if not ld_datasheet_languages:

    frappe.msgprint("Datasheet Language Not found, proceeding with English Language")
    la_languages = ["en"]
else:
    la_languages = [l_language.language for l_language in ld_datasheet_languages]


# >>ISS-2025-00051
def fn_remove_attachment_from_quotation(im_doc):
    # Fetch the list of attachments related to the quotation document
    la_file_list = frappe.get_all(
        "File",
        fields=["name"],
        filters={
            "attached_to_doctype": im_doc.doctype,
            "attached_to_name": im_doc.name,
        },
    )
    # Delete the fetched attachments based on their names
    frappe.delete_doc(
        "File", [ld_file["name"] for ld_file in la_file_list], ignore_permissions=True
    )


# Call the function to remove attachments from the quotation document
fn_remove_attachment_from_quotation(doc)  # <<ISS-2025-00051

for ld_doc_item in doc.items:
    # Get the item object
    ld_item = frappe.get_doc("Item", ld_doc_item.item_code).as_dict()
    # Call the function to copy files to quotation
    fn_copy_file_from_item_to_quotation(ld_item, doc, la_languages)
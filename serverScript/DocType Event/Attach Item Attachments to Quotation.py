def copy_file_from_item_to_quotation(item, doc):
    fileids = frappe.get_all('File', fields=['name'],
                             filters={'attached_to_doctype': item.doctype,
                             'attached_to_name': item.name},
                             order_by='creation desc')
    for fileid in fileids:
        file = frappe.get_doc('File', fileid).as_dict()
        fileQuotation = frappe.get_doc({
			"doctype": "File",
			"file_url": file.file_url,
			"file_name": file.filename,
			"attached_to_doctype": doc.doctype,
			"attached_to_name": doc.name,
			"folder": file.folder,
			"file_size": file.file_size,
			"is_private": file.is_private,
			"content_hash": file.content_hash
		})
        
        fileQuotation.flags.ignore_permissions = True
        try:
            fileQuotation.insert()
        except frappe.DuplicateEntryError:
            duplicate =  frappe.get_doc("File", fileQuotation.duplicate_entry)
for doc_item in doc.items:
    item = frappe.get_doc("Item", doc_item.item_code).as_dict()
    copy_file_from_item_to_quotation(item, doc)
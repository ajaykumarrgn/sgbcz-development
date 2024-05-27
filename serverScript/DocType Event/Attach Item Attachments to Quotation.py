def fn_copy_file_from_item_to_quotation(im_item, im_doc, im_languages):
    def fn_get_language_suffixes(im_languages, im_ext):
        # Generate language-specific file extensions
        return [('-' + l_language + '.' + im_ext) for l_language in im_languages]
        
      
    # Get the list of file IDs attached to the given item  
    la_fileids = frappe.get_all('File', fields=['name'],
                             filters={'attached_to_doctype': im_item.doctype,
                             'attached_to_name': im_item.name},
                             order_by='creation desc')
    
    # Extract file names from file IDs
    la_files = [ld_fileid.name for ld_fileid in la_fileids ]
    
    #get the file_name, file_url, file_size, is_private, and content_hash for all the file ids in the la_fileids
    la_file_list = frappe.get_all("File", 
                    filters={'name': ['IN', la_files]}, 
                    fields=[ 'file_name','file_url', 'folder', 'file_size', 'is_private', 'content_hash']
                )
    
    # Frame the PDF extension for the customer print language
    l_language_suffix = '-' + im_doc.language + '.' + 'pdf'
    
    #filter the attached files in the given item based on the customer print language
    la_print_language_records = [l_record for l_record in la_file_list if l_record['file_name'].endswith(l_language_suffix)]

    #filter the attached files without language suffix
    la_other_records = [l_record for l_record in la_file_list if not l_record['file_name'].endswith(tuple(fn_get_language_suffixes(im_languages, 'pdf')))]
    
    #Concatenate l_print_language_records and l_other_records
    la_filtered_files = []
    la_filtered_files.extend(la_other_records)
    la_filtered_files.extend(la_print_language_records)
    
    
    for l_file in la_filtered_files:
        # file = frappe.get_doc('File', fileid).as_dict()
        #create a new file obj
        lo_fileQuotation = frappe.get_doc({
			"doctype": "File",
			"file_url": l_file.file_url,
			"file_name": l_file.file_name,
			"attached_to_doctype": im_doc.doctype,
			"attached_to_name": im_doc.name,
			"folder": l_file.folder,
			"file_size": l_file.file_size,
			"is_private": l_file.is_private,
			"content_hash": l_file.content_hash
		})
        
        lo_fileQuotation.flags.ignore_permissions = True
        try:
            #insert the created file in the quotation
            lo_fileQuotation.insert()
        except frappe.DuplicateEntryError:
            ld_duplicate =  frappe.get_doc("File", lo_fileQuotation.duplicate_entry)
for l_doc_item in doc.items:
    
    # Define the list of languages
    la_languages= ['de','fr', 'cs', 'en']
    # Get the item object
    ld_item = frappe.get_doc("Item", l_doc_item.item_code).as_dict()
    fn_copy_file_from_item_to_quotation(ld_item, doc, la_languages)
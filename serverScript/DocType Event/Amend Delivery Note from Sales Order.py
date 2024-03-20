def amend_cancelled_delivery_note(cancelled_delivery_note, doc):
    # Sort by planned_production_end_date will not work if the date is empty in item
    # Splice the schedule line array into with dates and without dates
    # sort the array with records with date and then extend the without dates array
    # so that records without dates will be removed first and the records with farthest date
    # will be removed later accroding to the reduction in the quantity of DTTHZ2N item in Sales Order
    def sort_schedule_lines_by_date(target_lines):
        # Initialize the local arrays
        target_line_with_date = []
        target_line_without_date = []
        
        # Iterate the target schedule_lines
        for target_line in target_lines:
            # check if the schedule_line has a planned_production_end_date
            if target_line.planned_production_end_date:
                # add the schedule_line to with dates array
                target_line_with_date.append(target_line)
            # if planned_production_end_date is empty
            else:
                # add the schedule_line to with dates array
                target_line_without_date.append(target_line)
                
        # Now sort the spliced schedule lines by planned_production_end_date and move the ouput to
        # target_lines
        target_lines = sorted(target_line_with_date, key=lambda d: d.planned_production_end_date)
        
        # then add the records without dates to the target_lines
        target_lines.extend(target_line_without_date)
        return target_lines
    
    # Prepare the shedule lines for every Sales Order main item(DTTHZ2N)
    # by comparing the source schedule lines ie the cancelled delivery note schedule lines
    # If the Sale Order item is revised with more quantity then target schedule lines will 
    # be added with delta more times the schedule_line(s)
    # If the Sale Order item is revised with lesser quantity then target schedule lines will 
    # be reduced with delta less times the schedule_line(s). shedule lines with farthest planned_production_end_date
    # should be removed
    def make_target_lines_per_so_item(item, source_lines):
        # Initialize the serial no array
        a_serial_numbers= []
        
        target_lines = source_lines
        
        # if serial no is present in the sales order item
        if item.serial_no:
            # then get the individaul serial number to another array
            a_serial_numbers= item.splitlines()
            
        # Check If sales order quantity is revised with more quantity
        if len(source_lines) < int(item.qty):
            
            # then iterate difference(delta) times the quantity and number of schedule lines records
            # to form the schedule line row and append to the item schedule lines
            for i in range(len(source_lines), int(item.qty)):
                schedule_row = {}
                schedule_row['pos'] = item.pos
                schedule_row['item_code'] =  item.item_code
                schedule_row['status'] = 'Purchasing'
                schedule_row['delivery_date'] = item.delivery_date,
                schedule_row['oa_confirmed_date'] = item.delivery_date
                target_lines.append(schedule_row)
                
        # chedk if sales order quantity is revised with less quantity
        elif len(source_lines) > int(item.qty):
            
            # reduce the number of schedule lines from the sorurce lines by removing the lines with either no 
            # planned_production_end_date or lines with farthest planned_production_end_date
            target_lines = sort_schedule_lines_by_date(target_lines)
            target_lines = target_lines[:int(item.qty)]
        return target_lines
    
    def get_source_schedule_lines_for_the_item(item, source_schedule_lines):
        item_schedule_lines = [d for d in source_schedule_lines if d.get("item_code") == item.item_code]
        return item_schedule_lines
        
    # Create a new draft copy
    # new_doc = frappe.copy_doc(cancelled_doc)
    # make_delivery_note is a whitelisted function avaialble in the dotted path
    # used to copy the follow up document 
    # refer https://gist.github.com/revant/c2198c53673119e7020409764cf54a8c
    # refer https://github.com/frappe/erpnext/blob/develop/erpnext/selling/doctype/sales_order/sales_order.py#L867
    target_del_note = frappe.call("erpnext.selling.doctype.sales_order.sales_order.make_delivery_note", source_name=doc.name)
    
    # Load the cancelled delivery_note
    cancelled_del_doc = frappe.get_doc('Delivery Note', cancelled_delivery_note)
    
    # Initialize the final target schedule lines
    doc_target_lines = []
    
    # Iterate the parent items(Items with DTTHZ2N) of the current sales order
    for item in (item for item in doc.items if item.pos % 10 == 0):
    
        item_source_lines = get_source_schedule_lines_for_the_item(item, cancelled_del_doc.delivery_schedule)
        item_target_lines = make_target_lines_per_so_item(item, item_source_lines)
        doc_target_lines.extend(item_target_lines)
        
    # Add Schedule lines to target delivery document   
    for target_line in doc_target_lines:
        
        child_doc = frappe.new_doc("Delivery Schedule")
        child_doc = target_line
        target_del_note.append('delivery_schedule', child_doc)
    
    # Pass the amended_from reference
    target_del_note.amended_from = cancelled_del_doc.name

    # Save the new document
    target_del_note.insert()
    
# begin of the server run_script
if doc.amended_from:
    # Get the previously cancelled delivery document for the cancelled sales order
    # The cancelled sales order is nothing but the amended_from of the current sales order
    cancelled_delivery_note = frappe.get_all('Delivery Note Item', fields=['parent'], filters={"against_sales_order": doc.amended_from, 'pos': 10})
    
    # Proceed only if there is a delivery document for the original sales order
    if cancelled_delivery_note:
        # Amend the cancelled delivery note
        amend_cancelled_delivery_note(cancelled_delivery_note[0].parent, doc)

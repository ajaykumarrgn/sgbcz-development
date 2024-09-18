"""
Change Reference:
ISS-2024-00093 - Duplicate Serial number error arises from the Cancelled Document
"""


def fn_amend_cancelled_delivery_note(i_cancelled_delivery_note, id_doc):
    # Sort by planned_production_end_date will not work if the date is empty in item
    # Splice the schedule line array into with dates and without dates
    # sort the array with records with date and then extend the without dates array
    # so that records without dates will be removed first and the records with farthest date
    # will be removed later accroding to the reduction in the quantity of DTTHZ2N item in Sales Order
    def fn_sort_schedule_lines_by_date(ia_target_lines):
        # Initialize the local arrays
        la_target_line_with_date = []
        la_target_line_without_date = []

        # Iterate the target schedule_lines
        for ld_target_line in ia_target_lines:
            # check if the schedule_line has a planned_production_end_date
            if ld_target_line.planned_production_end_date:
                # add the schedule_line to with dates array
                la_target_line_with_date.append(ld_target_line)
            # if planned_production_end_date is empty
            else:
                # add the schedule_line to with dates array
                la_target_line_without_date.append(ld_target_line)

        # Now sort the spliced schedule lines by planned_production_end_date and move the ouput to
        # target_lines
        la_target_lines = sorted(
            la_target_line_with_date, key=lambda ld_date: ld_date.planned_production_end_date
        )

        # then add the records without dates to the target_lines
        la_target_lines.extend(la_target_line_without_date)
        return la_target_lines

    # Prepare the shedule lines for every Sales Order main item(DTTHZ2N)
    # by comparing the source schedule lines ie the cancelled delivery note schedule lines
    # If the Sale Order item is revised with more quantity then target schedule lines will
    # be added with delta more times the schedule_line(s)
    # If the Sale Order item is revised with lesser quantity then target schedule lines will
    # be reduced with delta less times the schedule_line(s). shedule lines with farthest planned_production_end_date
    # should be removed
    def fn_make_target_lines_per_so_item(id_item, ia_source_lines):
        # Initialize the serial no array
        la_serial_numbers = []

        la_target_lines = ia_source_lines

        # if serial no is present in the sales order item
        if id_item.serial_no:
            # then get the individaul serial number to another array
            la_serial_numbers = id_item.splitlines()

        # Check If sales order quantity is revised with more quantity
        if len(ia_source_lines) < int(id_item.qty):

            # then iterate difference(delta) times the quantity and number of schedule lines records
            # to form the schedule line row and append to the item schedule lines
            for i in range(len(ia_source_lines), int(id_item.qty)):
                ld_schedule_row = {}
                ld_schedule_row["pos"] = id_item.pos
                ld_schedule_row["item_code"] = id_item.item_code
                ld_schedule_row["status"] = "Purchasing"
                ld_schedule_row["delivery_date"] = (id_item.delivery_date,)
                ld_schedule_row["oa_confirmed_date"] = id_item.delivery_date
                la_target_lines.append(ld_schedule_row)

        # chedk if sales order quantity is revised with less quantity
        elif len(ia_source_lines) > int(id_item.qty):

            # reduce the number of schedule lines from the sorurce lines by removing the lines with either no
            # planned_production_end_date or lines with farthest planned_production_end_date
            la_target_lines = fn_sort_schedule_lines_by_date(la_target_lines)
            la_target_lines = la_target_lines[: int(id_item.qty)]
        return la_target_lines

    def fn_get_source_schedule_lines_for_the_item(id_item, ia_source_schedule_lines):
        la_item_schedule_lines = [
            ld_source_schedule_line
            for ld_source_schedule_line in ia_source_schedule_lines
            if ((ld_source_schedule_line.get("item_code") == id_item.item_code) 
                and (ld_source_schedule_line.get("pos") == id_item.pos)) #<< ISS-2024-00093
        ]
        return la_item_schedule_lines

    # Create a new draft copy
    # new_doc = frappe.copy_doc(cancelled_doc)
    # make_delivery_note is a whitelisted function avaialble in the dotted path
    # used to copy the follow up document
    # refer https://gist.github.com/revant/c2198c53673119e7020409764cf54a8c
    # refer https://github.com/frappe/erpnext/blob/develop/erpnext/selling/doctype/sales_order/sales_order.py#L867
    ld_target_del_note = frappe.call(
        "erpnext.selling.doctype.sales_order.sales_order.make_delivery_note",
        source_name = id_doc.name,
    )

    # Load the cancelled delivery_note
    ld_cancelled_del_doc = frappe.get_doc("Delivery Note", i_cancelled_delivery_note)

    # Initialize the final target schedule lines
    la_doc_target_lines = []

    # Iterate the parent items(Items with DTTHZ2N) of the current sales order
    for ld_item in (ld_item for ld_item in id_doc.items if ld_item.pos % 10 == 0):

        la_item_source_lines = fn_get_source_schedule_lines_for_the_item(
            ld_item, ld_cancelled_del_doc.delivery_schedule
        )
        la_item_target_lines = fn_make_target_lines_per_so_item(
            ld_item, la_item_source_lines
        )
        la_doc_target_lines.extend(la_item_target_lines)

    # Add Schedule lines to target delivery document
    for ld_target_line in la_doc_target_lines:

        ld_child_doc = frappe.new_doc("Delivery Schedule")
        ld_child_doc = ld_target_line
        ld_target_del_note.append("delivery_schedule", ld_child_doc)

    # Pass the amended_from reference
    ld_target_del_note.amended_from = ld_cancelled_del_doc.name

    # Save the new document
    ld_target_del_note.insert()


# begin of the server run_script
if doc.amended_from:
    # Get the previously cancelled delivery document for the cancelled sales order
    # The cancelled sales order is nothing but the amended_from of the current sales order
    la_cancelled_delivery_note_items = frappe.get_all(
        "Delivery Note Item",
        fields=["parent"],
        filters={"against_sales_order": doc.amended_from, "pos": 10},
    )

    # Proceed only if there is a delivery document for the original sales order
    if la_cancelled_delivery_note_items:
        # Amend the cancelled delivery note
        fn_amend_cancelled_delivery_note(la_cancelled_delivery_note_items[0].parent, doc)

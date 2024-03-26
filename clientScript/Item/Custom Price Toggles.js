// Change Request: TASK-2024-00157
frappe.ui.form.on('Item', {
    // Define a custom function triggered when the is_catalog_item field is changed
	is_catalog_item(frm) {
		frm.doc.override_price = false
		frm.doc.item_price_override = []
		frm.refresh_fields()
	},
	refresh(frm){
	    //check for if not catalog item or not accessories
	    //allow override 
	    //else make it read only
	    // Check if the item is not a catalog item or does not belong to the 'Accessories' item group
	    // Check if the item is not a catalog item or does not belong to the 'Accessories' item group
        // if (!frm.doc.is_catalog_item || frm.doc.item_group['parent_item_group'] != 'Accessories') {
        if (!frm.doc.is_catalog_item ) {
        // || frm.doc.item_group['parent_item_group'] != 'Accessories') {
            // Set the 'override_price' and 'item_price_override' field to not read-only
            frm.set_df_property('override_price', 'read_only', false);
            frm.set_df_property('item_price_override', 'read_only', false);
        } else {
            // If the item is a catalog item and belongs to the 'Accessories' group, make all fields read-only
            frm.set_read_only();
    
        }

	}
})
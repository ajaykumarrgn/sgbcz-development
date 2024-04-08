frappe.ui.form.on('Item', {
	// Disable the override price field when the catalog_item field is changed
    is_catalog_item: function(frm) {
        frm.doc.override_price = false;
        frm.doc.item_price_override = [];
        frm.refresh_fields();

    },
    refresh: function(frm) {
        // Get the parent item group (e.g., "Accessories") from the Item Group doctype using a filter
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'Item Group',
                fieldname: ['parent_item_group'],
                filters: { name: frm.doc.item_group }
            },
            callback: function(response) {
                var ld_message = response.message;
				// Check if the item's parent_item_group is "Accessories" or is_catalog_item. 
                if (ld_message.parent_item_group === "Accessories" || frm.doc.is_catalog_item) {
                    // Disable the override_price field if conditions are met
                    $('input[data-fieldname="override_price"]').prop('disabled', true);
                } else {
                    // Enable the override_price field if conditions are not met
                    $('input[data-fieldname="override_price"]').prop('disabled', false);
                }
            }
        });
    }
});

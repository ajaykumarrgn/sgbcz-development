frappe.ui.form.on('Item', {
    refresh: function(frm) {
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
                if (ld_message.parent_item_group === "Accessories" || ld_message.parent_item_group === "DTTHZ2N" || frm.doc.item_group === "DTTHZ2N" || frm.doc.item_group === "Accessories" ) {
                    // Disable the override_price field if conditions are met
                    frm.set_df_property('override_price', 'hidden', false);
                    frm.set_df_property('material_cost', 'hidden', false);
                    
                } else {
                    // Enable the override_price field if conditions are not met
                    frm.set_df_property('override_price', 'hidden', true);
                    frm.set_df_property('material_cost', 'hidden', true);
                    frm.set_df_property('total_cost', 'hidden', true);
                }
            }
        });
    }
});

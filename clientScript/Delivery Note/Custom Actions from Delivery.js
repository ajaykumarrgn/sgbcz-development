frappe.ui.form.on('Delivery Note', {
refresh(frm) {

		if(!frm.fields_dict.delivery_schedule.grid.wrapper.find(".grid-upload").is(":visible"))
		{
		    frm.set_df_property('delivery_schedule', 'allow_bulk_edit',1);
		    frm.fields_dict.delivery_schedule.grid.setup_allow_bulk_edit();
		}

	    //Add the "Report" button in Delivery Note
	    frm.add_custom_button(__("Report"), function() {
        // When this button is clicked

        // Call the Purchase Order Evidence Report
            frappe.set_route('query-report', 'Sales Table');
        });
        
    
        frm.add_custom_button(__("Order"), function() {
            var sales_order =frm.doc.items[0].against_sales_order;
            // When this button is clicked,
            /*frappe.call({
                "method": "frappe.client.get_list",
    		    "args": {"doctype": "Delivery Note Item", "parent": 'Delivery Note', },
    		    'fieldname': ["against_sales_order","pos",],
    		    "filters": { "parent": frm.doc.name, "pos": 10 },
    		    "callback": function(response) {   
  
                    console.log('delivery Item',response.message)
                }
            })*/
            // Call the Purchase Order Evidence Report
            frappe.set_route('sales-order', sales_order);
        });

	}
})

frappe.ui.form.on('Delivery Schedule', {
	refresh(frm) {
		// your code here
	}
})
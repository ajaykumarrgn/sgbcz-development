frappe.ui.form.on('Sales Order', {
refresh(frm) {
	    //Add the "Del Note" button in Sales Order
	    frm.add_custom_button(__("Del Note"), function() {
        // When this button is clicked,
 
         frappe.call({
	         	"method": "frappe.client.get",
        		"args": {
        		    "doctype": "Delivery Note Item", 
        		    "parent": "Delivery Note", 
        		    async: false, 
        		    filters:{"against_sales_order": frm.doc.name, 'pos': 10},
        		    fields:['parent']},
        		"callback": function(response) {
        		    if(response.message) {
        		        var delivery_note = response.message.parent;
        		        frappe.set_route('delivery-note', delivery_note);
        		    }
        		}});   
    });

	}
})
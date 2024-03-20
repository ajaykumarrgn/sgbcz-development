frappe.ui.form.on('Design', {
	refresh(frm) {
	    if (frm.doc.status == 'Calculation Received') {
	       // frappe.call({
                // method: 'frappe.desk.form.linked_with.get_linked_docs',
                // args: {
                //     doctype: 'Item',
                //     name: frm.docname
                // },
  
                // method: 'frappe.desk.form.linked_with.get',
                // args: {
                //     doctype: 'Item',
                //     docname: frm.docname
                // },
                // callback: function(response) {
                //     console.log('message from get_linked', response.message);
                // }});
	        if (frm.doc.item){
	            //Add the "Create Item" button in Sales Order
        	    frm.add_custom_button(__("View Item"), function() {
        	        frappe.set_route('item', frm.doc.item);
        	    });
	        } else {
        		//Add the "Create Item" button in Sales Order
        	    frm.add_custom_button(__("Create Item"), function() {
                // When this button is clicked,
                //  console.log('Inside Create Item From Design', frm.doc.name);
                 frappe.call({
        	         	"method": "create_item_from_design",
                 		"args": {
                		    "design": frm.doc.name, 
                 		},
                		"callback": function(response) {
                		    if(response.message) {
                                frappe.show_alert({
                                    message:__('Item Created'),
                                    indicator:'green'
                                }, 5);
                                frm.set_value('item', response.message.item_code);
                                frm.refresh_fields();
                                frm.save();
                		      //  var delivery_note = response.message.parent;
                		      //  frappe.set_route('delivery-note', delivery_note);
                		    }else{                        
                		        frappe.show_alert({
                                    message:__('Error Creating Item'),
                                    indicator:'red'
                                }, 5); }
                		}});   
                });
	        }
	    }
	}
});
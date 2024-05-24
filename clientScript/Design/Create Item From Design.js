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
                 frappe.call({
        	         	"method": "create_item_from_design",
                 		"args": {
                		    "design": frm.doc.name, 
                 		},
                		"callback": function(response) {
                		    if(response.message) {
                		        frappe.show_alert({
                                            message: __('Item Created'),
                                            indicator: 'green'
                                        }, 5);
                                        frm.set_value('item', response.message.item_code);
                                        frm.refresh_fields();
                                        frm.save().then(function(){
                                            // frappe.msgprint('Please wait, PDF generation has started.');
                                            frappe.show_progress('Creating with Pdf..', 50, 100, 'Please wait');  
                                            // After saving, call the fn_pdf_attachment method
                                            const LA_LANGUAGES = ["de", "cs","fr", "en"];
                                            frappe.call({
                                                "method": "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                                                "args": {
                                                    "im_source_doc_type": frm.doc.doctype,
                                                    "im_source_doc_name": frm.doc.name,
                                                    "im_languages": LA_LANGUAGES,
                                                    // "im_print_format": null,
                                                    "im_letter_head": "Data Sheet",
                                                    "im_target_doc_type": "Item",
                                                    "im_target_doc_name": response.message.item_code
                                                },
                                                "callback": function(pdfResponse){
                                                    if(pdfResponse.message){
                                                        // frappe.msgprint("The item is created and the PDF is attached successfully.")
                                                        frappe.hide_progress()
                                                        
                                                    }
                                                }
                                        });
                		    })
                            
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
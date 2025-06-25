frappe.ui.form.on('Design', {
	refresh(frm) {
	   if (frm.doc.status == 'Calculation Received') {  
	       if (frm.doc.item){
	            //Add the "View Item" button in Design
        	    frm.add_custom_button(__("View Item"), function() {
        	        frappe.set_route('item', frm.doc.item);
        	    });
	        } else {
        		//Add the "Create Item" button in Design
        	    frm.add_custom_button(__("Create Item"), function() {
                 // An item will be created, and the item_code will be
                // set as the value in the design's item field.
                // Upon successful item creation and saving,
                // PDF generation will take place.
                 frappe.call({
        	        "method": "beta_create_item_from_design",
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
                                frappe.show_progress(__('Creating with Pdf..'), 50, 100, __('Please wait'));
                                frappe.call({
                                    "method": "frappe.client.get",
                                    "args":{
                                        "doctype": "Design Configuration",
                                        "filters" : {"transformer_type": frm.doc.transformer_type,
                                            "is_design": frm.doc.is_design
                                        }
                                    },
                                    "callback":function(gitraResponse){

                                        if(gitraResponse.message){
                                            console.log(gitraResponse.message);
                                            // After saving, call the fn_pdf_attachment method
                                            const ldDatasheetLanguages = gitraResponse.message.datasheet_languages;
                    
                                            // Using map to extract language codes into laLanguages array
                                            const laLanguages = ldDatasheetLanguages.map(function(laLanguage) {
                                                return laLanguage.language;
                                            });

                                            // In the fn_pdf_attachment function, the filename is generated using the argument
                                            // im_file_name, which takes a string that includes a placeholder for language.
                                            // Example: 'Datasheet_${l_title}_${frm.doc.name}_{language}'
                                            // Here, {language} is the placeholder, ensuring the language appears at the end.
                                            
                                             // The design title will be used as the filename.
                                            let lTitle = frm.doc.title;

                                            if (lTitle) {
                                                // Find the position of the first space
                                                let lSpaceIndex = lTitle.indexOf(' ');
                                                // Remove everything up to the first space
                                                if (lSpaceIndex !== -1) {
                                                    lTitle = lTitle.substring(lSpaceIndex + 1);
                                                }
                                                // Replace slashes with gitra separator
                                                lTitle = lTitle.replace(/\//g, gitraResponse.message.naming_separator);
                                            }
                                            frappe.call({
                                                "method": "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                                                "args": {
                                                    "im_source_doc_type": frm.doc.doctype,
                                                    "im_source_doc_name": frm.doc.name,
                                                    "im_languages": laLanguages,
                                                    // "im_print_format": null,
                                                    "im_letter_head": "Data Sheet",
                                                    "im_target_doc_type": "Item",
                                                    "im_target_doc_name": response.message.item_code,
                                                    "im_file_name": `Datasheet_${lTitle}_${frm.doc.name}_{language}`
                                                },
                                                "callback": function(pdfResponse){
                                                    if(pdfResponse.message){
                                                        frappe.hide_progress()
                                                            
                                                    }
                                                }
                                            });
                                        }
                                    }
                                })

                		    })
                            
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
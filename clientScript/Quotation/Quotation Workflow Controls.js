frappe.ui.form.on('Quotation', {
	refresh(frm) {
		setTimeout(() => {
            // The print functionality should not be available
            // for any workflow status other than Approved or Self Approved
		    if(!["Approved", "Self Approved"].includes(
                    frm.doc.workflow_state)) {
                //clearing all the custom buttons on the form
    			frm.clear_custom_buttons();
                // DOM manipulation on the print icon using its ID
                // along with translation compatibility
                $("button[data-original-title=" + __("Print") + "]").hide();
                
                //removing email option 
                //in Menu (standard button group)
                $('a.grey-link').each(function() {
                  
                    // Comparing data-label instead of Button Text
                    var id = $(this).children(':first-child').attr('data-label'); 
                  
                    switch(id){
                        case __("Email"):
                             $(this).remove();
                             break;
                        default:
                            break;
                            
                    }
                });
		    }
        }, 10);
		
	}
})
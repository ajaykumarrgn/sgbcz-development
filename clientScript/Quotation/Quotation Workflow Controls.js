frappe.ui.form.on('Quotation', {
	refresh(frm) {
		setTimeout(() => {
		    
		    if(frm.doc.workflow_state != "Approved") {

    			frm.clear_custom_buttons();
    		
                $("button[data-original-title=" + __("Print") + "]").hide();
                
                $('a.grey-link').each(function() {
                  
                    // Comparing data-label instead of Button Text
                    var id = $(this).children(':first-child').attr('data-label'); 
                  
                    switch(id){
                        case __("Print"):
                             $(this).remove();
                             break;
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
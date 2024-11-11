//Clear the status filters when enter into the new design form(ISS-2024-00133)
frappe.ui.form.on('Design', {
    //Reseting the framework functionality of carring 
    //the filter value to the full form on creating new document
	refresh(frm) {
	    if(frm.is_new() && frm.is_dirty()){
	        frm.set_value('status', 'Draft');
	    }
	}
});
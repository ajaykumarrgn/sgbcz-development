frappe.ui.form.on('Customer', {
	refresh(frm) {
	 
	    if(frm.is_new() && !frm.doc.account_manager){
	        frm.doc.account_manager = frappe.session.user;
	        frm.refresh_fields();
	    }
		// your code here
	}
});
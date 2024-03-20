frappe.ui.form.on('Payment Terms Template', {
	onload(frm) {
		frm.set_df_property('terms', 'reqd', 0);
	    frm.set_df_property('terms', 'hidden', 0);
		var invoice_portion = frappe.meta.get_docfield("Payment Terms Template Detail","invoice_portion", frm.doc.name);
		invoice_portion.reqd = 0;
        var due_date_based_on = frappe.meta.get_docfield("Payment Terms Template Detail","due_date_based_on", frm.doc.name);
        due_date_based_on.reqd = 0;
        
	},
	refresh(frm) { 
	    if (!frm.doc.terms[0].invoice_portion) {
	       frm.doc.terms[0].invoice_portion=100; 
	       frm.refresh_fields();
	    }
	}
});

frappe.ui.form.on('Payment Terms Template Detail', {
	onload(frm) {
	    frm.set_df_property('invoice_portion', 'reqd', 0);   
	    frm.set_df_property('due_date_based_on', 'reqd', 0);
	},
	validate(frm) {
	    console.log('payment terms details', frm)
	}
});
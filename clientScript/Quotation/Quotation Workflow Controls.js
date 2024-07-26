frappe.ui.form.on('Quotation', {
	refresh(frm) {
		setTimeout(() => {
            // frm.remove_custom_button('Update Items');
            // frm.remove_custom_button('Close', 'Status');
            // frm.remove_custom_button('Work Order', 'Make');
			frm.clear_custom_buttons();
        }, 10);
	}
})
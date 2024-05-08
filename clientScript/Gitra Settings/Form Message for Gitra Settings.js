frappe.ui.form.on('Gitra Settings', {
    refresh(frm) {
        const ltransformerType = frm.doc.transformer_type
        if (ltransformerType) {
          frm.set_intro('You are viewing the Gitra Settings for item template ' + ltransformerType, 'blue');
        }
    }
});

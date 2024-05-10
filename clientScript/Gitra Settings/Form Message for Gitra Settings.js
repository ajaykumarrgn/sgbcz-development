frappe.ui.form.on('Gitra Settings', {
    refresh(frm) {
        //Get the Transformer Type from the Parent DocType "Gitra Settings"
        const ltransformerType = frm.doc.transformer_type
        if (ltransformerType) {
          //Set Intro message at top of the form in blue color
          frm.set_intro('You are viewing the Gitra Settings for item template ' + ltransformerType, 'blue');
        }
    }
});

frappe.ui.form.on('Item', {
    set_attributes_to_edit(frm){
	    // Allow Edit of Item Variants table after validation error and before save
        frm.set_df_property("attributes", "read_only", (frm.is_new() || frm.doc.has_variants) ? 0 : 1);  
	},
	validate(frm) {
	    // Allow Edit of Item Variants table after validation error and before save
	    frm.events.set_attributes_to_edit(frm);
	},
	refresh(frm){
	    // Allow Edit of Item Variants table after validation error and before save
	    frm.events.set_attributes_to_edit(frm);
	}
	
})
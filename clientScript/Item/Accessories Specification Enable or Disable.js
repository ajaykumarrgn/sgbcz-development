frappe.ui.form.on('Item', {
	refresh(frm) {
		frappe.db.get_value("Item Group", {"name":frm.doc.item_group}, "old_parent", function(itemgroup){
            if(itemgroup.old_parent!='Accessories'){
                frm.set_df_property('accessories_specification', 'hidden', 1); 
                frm.refresh_fields();
        	}else {
            	frm.set_df_property('accessories_specification', 'hidden', 0); 
                frm.refresh_fields();
        	}
        });
	}
})
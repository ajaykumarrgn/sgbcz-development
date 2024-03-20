frappe.ui.form.on('Sales Order', {
	refresh(frm) {
		// your code here
	},
	after_save(frm) {
	   //Mandatory fields are getting cleard in sales order header like customer, purhchase order 
	   //after adding the first item and moving to the second item.
	   //This is not happening when we reload the document
	   //frm.reload_doc();
	},
	get_pos(frm, item){
	    var prev_item = frm.doc.items[item.idx-2];
        // If Previous Item is available(eg DTTZ2N-1600/10/6/75)
	    // Then find the item group
	    // If parent item group is Accessories or item group is Servies then add .1 to the pos(eg from 10 to 10.1 or 10.1 to 10.2)
	    // If DTTZ2N then round of previous pos to whole number of 10s(eg 10.4 to 10)
	    // and add 10 to it( eg 10.4 will become 20)
	    // Carry forward the Main item Quantity(Items with whole 10s ie item groups other than Accessories and Services)
	    // to sub items.
	    if(prev_item){
	        frappe.call({
	         	"method": "frappe.client.get",
        		"args": {"doctype": "Item", "name": item.item_code, async: false, fields:['item_group']},
        		"callback": function(response) { 
        		    frappe.db.get_value("Item Group", {"name":response.message.item_group}, "old_parent", function(itemgroup){
        		        if(itemgroup.old_parent=='Accessories' || response.message.item_group=='Services'){
            	            item.pos = prev_item.pos + 1/10;
            	            item.qty = prev_item.qty;
            	            frm.refresh_fields();
    	                }else {
        	                item.pos = Math.floor(prev_item.pos) + 10;
            	            frm.refresh_fields();
    	                }
        		    });
        		}});  
	        
	    } else{
	        return 10;
	    }
	   /* // Previous item from the items array
	    var prev_item = frm.doc.items[item.idx-2];
	    // If Previous Item is available(eg DTTZ2N-1600/10/6/75)
	    // Then find the item group
	    // If Accessories or Servies then add .1 to the pos(eg from 10 to 10.1 or 10.1 to 10.2)
	    // If DTTZ2N then round of previous pos to whole number of 10s(eg 10.4 to 10)
	    // and add 10 to it( eg 10.4 will become 20)
	    // Carry forward the Main item Quantity(Items with whole 10s ie item groups other than Accessories and Services)
	    // to sub items.
	    if(prev_item){
	        frappe.call({
	         	"method": "frappe.client.get",
        		"args": {"doctype": "Item", "name": item.item_code, async: false, fields:['item_group']},
        		"callback": function(response) { 
            		if(response.message.item_group=='Accessories' || response.message.item_group=='Services'){
        	            item.pos = prev_item.pos + 1/10;
        	            item.qty = prev_item.qty;
        	            frm.refresh_fields();
    	            }else {
    	                item.pos = Math.floor(prev_item.pos) + 10;
        	            frm.refresh_fields();
    	            }
        		}
	        });
        	
	    } else{
	        return 10;
	    } */
	},
});

frappe.ui.form.on('Sales Order Item', {

    item_code(frm, cdt, cdn) {
	     var item = locals[cdt][cdn];
		if (!item.pos ){
		    frm.events.get_pos(frm, item);
		    item.pos = frm.events.get_pos(frm, item);
		    frm.refresh_fields();
		}
	},
	refresh(frm) {
		// your code here
	}
})
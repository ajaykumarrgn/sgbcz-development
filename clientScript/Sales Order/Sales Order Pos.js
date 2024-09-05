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
	    var ldPrevItem = frm.doc.items[item.idx-2];
        // If a previous item is available (e.g., "DTTZ2N-1600/10/6/75"):
		//   - Find the item group.
		//   - If the parent item group is "Accessories" or the item group is "Services":
		//     - Increment the position (pos) by 0.1 (e.g., change 10 to 10.1, or 10.1 to 10.2).
		//     - Set the parent item group to the previous item's parent item group.
		//   - If the item group is "DTTZ2N":
		//     - Round the previous position (pos) down to the nearest whole number (e.g., from 10.4 to 10).
		//     - Add 10 to the position (e.g., change 10.4 to 20).
		//     - Set the parent item group to the item's item group.
		//   - Carry forward the main item quantity (items with whole number positions, i.e., 
		//     	item groups other than "Accessories" or "Services") to their sub-items.
	    if(ldPrevItem){
	        frappe.call({
	         	"method": "frappe.client.get",
        		"args": {"doctype": "Item", "name": item.item_code, async: false, fields:['item_group']},
        		"callback": function(response) { 
        		    frappe.db.get_value("Item Group", {"name":response.message.item_group}, "old_parent", function(itemgroup){
        		        if(itemgroup.old_parent=='Accessories' || response.message.item_group=='Services'){
            	            item.pos = ldPrevItem.pos + 1/10;
            	            item.qty = ldPrevItem.qty;
            	            item.custom_parent_item_group = ldPrevItem.custom_parent_item_group;
            	            frm.refresh_fields();
    	                }else {
        	                item.pos = Math.floor(ldPrevItem.pos) + 10;
        	                item.custom_parent_item_group = item.item_group;
            	            frm.refresh_fields();
    	                }
        		    });
        		}});  
	        
	    } else{
	       // return 10;
	       item.pos = 10;
	       item.custom_parent_item_group = item.item_group;
	    }
	   /* // Previous item from the items array
	    var ldPrevItem = frm.doc.items[item.idx-2];
	    // If Previous Item is available(eg DTTZ2N-1600/10/6/75)
	    // Then find the item group
	    // If Accessories or Servies then add .1 to the pos(eg from 10 to 10.1 or 10.1 to 10.2)
	    // If DTTZ2N then round of previous pos to whole number of 10s(eg 10.4 to 10)
	    // and add 10 to it( eg 10.4 will become 20)
	    // Carry forward the Main item Quantity(Items with whole 10s ie item groups other than Accessories and Services)
	    // to sub items.
	    if(ldPrevItem){
	        frappe.call({
	         	"method": "frappe.client.get",
        		"args": {"doctype": "Item", "name": item.item_code, async: false, fields:['item_group']},
        		"callback": function(response) { 
            		if(response.message.item_group=='Accessories' || response.message.item_group=='Services'){
        	            item.pos = ldPrevItem.pos + 1/10;
        	            item.qty = ldPrevItem.qty;
        	            frm.refresh_fields();
    	            }else {
    	                item.pos = Math.floor(ldPrevItem.pos) + 10;
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
		if (!item.pos || !item.custom_parent_item_group){
		   frm.events.get_pos(frm, item);
		   //commented this line because we are 
		   //setting the pos and custom_parent_item_group
		  //  item.pos = frm.events.get_pos(frm, item);
		    frm.refresh_fields();
		}
	},
	refresh(frm) {
		// your code here
	}
})
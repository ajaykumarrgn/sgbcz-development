//Change Request
//>> TASK-2024-00218: Fetch the RDG number from the Item RDG Number to Sales order Item (# TASK-2024-00218)

frappe.ui.form.on('Sales Order', {
    
});

// If item have the RDG Number means fetch the rdg_number from the Item RDG Number Table from the sales order item to Item
frappe.ui.form.on('Sales Order Item', {
    // Define a function to be executed when the item_code field change
    item_code: function(frm, cdt, cdn) { 
        
        var lItem = locals[cdt][cdn];
        
        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "Item", 
                name: lItem.item_code
            },
            // Define a callback function to handle the response
            callback: function(iResponse) {
                // Check if the response contains item_rdg_number
                if (iResponse.message && iResponse.message.item_rdg_number) {
                    // Extract item_rdg_number from the response
                    const lRdgNumber = iResponse.message.item_rdg_number;
                    // Find the default rdg_number
                    var lDefaultRdgNumber = lRdgNumber.find(x => x.is_default === 1);
                    // Set rdg_number field value based on default rdg_number
                    lItem.rdg_number = lDefaultRdgNumber ? lDefaultRdgNumber.rdg_number : '';
                    
                    frm.refresh_fields();
                }
            }
        });
    }
});




frappe.ui.form.on('Sales Order', {
    onload(frm) {
        // Check if there are items in the Sales Order
        if (frm.is_new() && !frm.doc.custom_packaging && 
        !frm.doc.custom_warranty && frm.doc.items && 
        frm.doc.items.length > 0) {
            
            // Taking the first item
            let lFirstItem = frm.doc.items[0];
            // Stop execution if item code is empty
            if (!lFirstItem.item_code) {
                return;
            }
            if (lFirstItem.prevdoc_docname) {
                // Fetching packaging and warranty from parent quotation
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Quotation",
                        name: lFirstItem.prevdoc_docname
                    },
                    callback: function(response) {
                        if (response.message) {
                            frm.set_value('custom_packaging', response.message.ll_packaging);
                            frm.set_value('custom_warranty', response.message.warranty);
                        } else {
                            // console.log("Error fetching the quotation.");
                            fetchPackagingAndWarranty(frm);
                            
                        }
                    }
                });
            } else {
                fetchPackagingAndWarranty(frm);
            }
        } else {
            return;
        }
    },
    
    customer(frm) {
        if (!frm.doc.items[0].item_code || !frm.doc.items[0].prevdoc_docname) {
            fetchPackagingAndWarranty(frm);
        }else{
            frappe.msgprint(__(`This Sales Order is created from Quotation ${frm.doc.items[0].prevdoc_docname}`));
           
        }
    }
});

// Reusable function to fetch packaging and warranty
function fetchPackagingAndWarranty(frm) {
   
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Customer",
            name: frm.doc.customer
        },
        callback: function(response) {
            if (response.message) {
                frm.set_value('custom_packaging', response.message.packaging);
                frm.set_value('custom_warranty', response.message.warranty);
            } else {
                // Fetching from quotation preset
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Quotation Presets",
                    },
                    callback: function(response) {
                        if (response.message) {
                            frm.set_value('custom_packaging', response.message.packaging);
                            frm.set_value('custom_warranty', response.message.default_validity);
                        } else {
                            frappe.msg(__("No packaging and warranty at quotation preset."));
                        }
                    }
                });
            }
        }
    });
}

frappe.ui.form.on('Sales Order', {
    onload: function(frm) {
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
                    callback: function(quotationResponse) {
                        if (response.message) {
                            frm.set_value('custom_packaging', quotationResponse.message.ll_packaging);
                            frm.set_value('custom_warranty', quotationResponse.message.warranty);
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
    
    customer: function(frm) {
        if (!frm.doc.custom_packaging && !frm.doc.custom_warranty) {
            fetchPackagingAndWarranty(frm);
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
        callback: function(customerResponse) {
            if (response.message) {
                frm.set_value('custom_packaging', customerResponse.message.packaging);
                frm.set_value('custom_warranty', customerResponse.message.warranty);
            } else {
                // Fetching from quotation preset
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Quotation Presets",
                    },
                    callback: function(presetResponse) {
                        if (response.message) {
                            frm.set_value('custom_packaging', presetResponse.message.packaging);
                            frm.set_value('custom_warranty', presetResponse.message.default_validity);
                        } else {
                            frappe.msg(__("No packaging and warranty at quotation preset."));
                        }
                    }
                });
            }
        }
    });
}

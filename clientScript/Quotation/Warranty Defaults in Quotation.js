//Change Request
//Get the warranty period from the customer or 
//from the customer group <<ISS-2024-00148

frappe.ui.form.on('Quotation', {
    onload(frm) {
        // Check if the quotation is new and not in warranty
        if (frm.is_new() && !frm.doc.warranty && frm.doc.items && frm.doc.items.length > 0) {
            fnFetchWarrantyFromCustomer(frm);
        }
    },
    
    // Fetch warranty from the selected Customer when the customer is changed
    party_name(frm) {
        fnFetchWarrantyFromCustomer(frm);
    }
});

//Fetch the warranty period from the Customer
function fnFetchWarrantyFromCustomer(frm) {
    // Ensure the customer field is filled before proceeding
    if (!frm.doc.party_name) {
        return;
    }
    // Fetch warranty from the selected Customer
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Customer",
            name: frm.doc.party_name 
        },
        callback: function(response) {
            if (response.message) {
                // Set warranty from the customer
                frm.set_value('warranty', response.message.warranty);
            } else {
                // If no warranty found in the customer, 
                // so fetch from customer group
                fnFetchWarrantyFromCustomerGroup(frm);
            }
        }
    });
}

//Fetch the warranty period from the Customer Group if not in Customer only
function fnFetchWarrantyFromCustomerGroup(frm) {
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Customer Group",
            name: frm.doc.customer_group
        },
        callback: function(response) {
            if (response.message) {
                // Set warranty from the customer group
                frm.set_value('warranty', response.message.warranty);
            } else {
                frappe.msgprint(__('No warranty found in customer group.'));
            }
        },
    });
}

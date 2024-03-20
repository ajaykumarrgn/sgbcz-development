//Change Request
//>> TASK-2024-00217: Add Search Variant Button from the Sales order Item to Report #(TASK-2024-00217)

//Choose the itemcode from the Sales order Item to the Report by Using Search Variant option
frappe.ui.form.ControlLink.link_options = function(link) {
    // Check if the linked field is "item_code"
    if (link.df.fieldname === "item_code") {
    
        return [
            {
                // Define HTML markup for the link option from the sales order to report
                html: "<span class='text-primary link-option'>"
                    + "<i class='fa fa-search' style='margin-right: 5px;'></i> "
                    + __("Search Variant")
                    + "</span>",
                label: __("Search Variant"),
                value: "item",
                //when the option is clicked, then redirect to the report
                action: function() {
                    // Set route to the Item Variant Details Search report
                    frappe.set_route('query-report', 'Item Variant Details Search');
                    // Set route options including item code, quantity, item index, and document type
                    //The "doctype" is mentioned to support any doctype. This code is referenced for future use.
                    frappe.route_options = {
                        "item": "DTTHZ2N", 
                        "qty" : "1",
                        "item_idx": link.doc.idx,
                        "doctype": link.frm.doctype
                    };
                }
            }
        ];
    }
    
};

frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
        // When the add icon is clicked from the Item Variant search report and redirects to the Quotation
        // Set item_code passed from the report to the item_code of the last entry in the items table
        if (frappe.route_options.item_code) {
            // Get the row that was intended with the change
            //console.log(frappe.route_options.item_code);
            const LD_ROW = frm.doc.items[frappe.route_options.item_idx -1]; // Adjusted index to access the correct row
            
            // Use frappe model to set the item code of the intended row
            frappe.model.set_value(LD_ROW.doctype, LD_ROW.name, "item_code", frappe.route_options.item_code);
            // Finally trigger the change of the fields in the items(Sales Order Item) table
            frm.refresh_field("items");
        }
    }
});
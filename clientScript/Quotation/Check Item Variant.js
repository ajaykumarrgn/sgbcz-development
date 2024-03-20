//Choose the itemcode from the Quotation Item to the Report by Using Search Variant option
//Modify the code for the another Change Request (#TASK-2024-00217)
frappe.ui.form.ControlLink.link_options = function(link) {
    // Check if the fieldname of the link is "item_code"
    if (link.df.fieldname === "item_code") {
        // Return an array of link options
        return [
            {
                // Define HTML markup for the link option from the quotation to report
                html: "<span class='text-primary link-option'>" +
                      "<i class='fa fa-search' style='margin-right: 5px;'></i> " +
                      __("Search Variant") +
                      "</span>",
                
                label: __("Search Variant"),
                value: "item",
                //when the option is clicked, then redirect to the report
                action: function() {
                    // Set route to Item variant search Report
                    frappe.set_route('query-report', 'Item Variant Details Search');
                    //Set route options including item code, quantity, item index, and document type
                    //The "doctype" is mentioned to support any doctype. This code is referenced for future use.
                    frappe.route_options = {
                        "item": "DTTHZ2N",
                        "qty" : "1",
                        //>>TASK-2024-00217
                        "item_idx": link.doc.idx,
                        "doctype": link.frm.doctype
                        //<<TASK-2024-00217
                    };
                }
            }
        ];
    } 

   
};

frappe.ui.form.on('Quotation', {
    
    refresh: function(frm) {
        // When the add icon is clicked from the Item Varaint search report the report re-directs to the Quotation
        // Once redirected the item_code passed from the report is set to the item_code of last entry in the items table
        // this logic must be changed to make it more dynamic to handle mid entry search
        if (frappe.route_options.item_code) {
            // Get the row that was intended with the change
            const LD_ROW = frm.doc.items[frappe.route_options.item_idx -1];
            //  Use frappe model to set the item code of the intended row
            frappe.model.set_value(LD_ROW.doctype, LD_ROW.name, "item_code", frappe.route_options.item_code);
            // Finally trigger the change of the fields in the items(Quotation Item) table
            frm.refresh_field("items");

        }
    },
    
});



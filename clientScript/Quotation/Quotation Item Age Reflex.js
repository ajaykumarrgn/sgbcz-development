frappe.ui.form.on('Quotation', {
    refresh(frm) {
        // Call the highlight_older_item_price function when the Quotation form is refreshed
        frm.events.highlight_older_item_price(frm);
    },

   //Specify the highlight_older_item_price function
    highlight_older_item_price(frm, withInputFeeback) {
        // Loop through each item in the items field of the Quotation

        $.each(frm.doc.items || [], function(i, d) {
            // Check if item_code and pos are not undefined and pos is divisible by 10
            if (d.item_code != 'undefined' && d.pos != 'undefined' && d.pos % 10 === 0) {
                // Make a server call to retrieve item details 
                frappe.call({
                    method: 'frappe.client.get_value',
                    args: {
                        doctype: 'Item',
                        fieldname: ['design', 'override_price'],
                        filters: {
                            item_code: d.item_code,
                        },
                        async: false,
                    },
                    callback: (r) => {
                        // If item details is retrieved successfully
                        if (r.message && (r.message.design || r.message.override_price)) {
                           // Initiate another server call to fetch item price details
                            frappe.call({
                                method: "frappe.client.get_value",
                                args: {
                                    doctype: "Item Price",
                                    fieldname: ['modified'],
                                    filters: {
                                        item_code: d.item_code,
                                        price_list: frm.doc.selling_price_list
                                    }
                                },
                                async: false,
                                // Define a callback function that takes res as a parameter
                                callback: function(res) {
                                    // Ensure that 'res.message' is present and 'res.message.modified'
                                    if (res.message && res.message.modified) {
                                        // Create a new Date object from res.message.modified
                                        var modifiedDate = new Date(res.message.modified);
                                         // Create a Date object representing two months ago
                                        var twoMonthsAgo = new Date();
                                        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
                                        // Check if the item price was modified more than two months ago
                                        if (modifiedDate < twoMonthsAgo) {
                                            // Find the row within the grid
                                            const rowIndex = i + 1;
                                            const row = $(`.grid-row[data-idx='${rowIndex}']`);
                                            // Find the "rate" field element within the row
                                            const rateField = row.find('[data-fieldname="rate"][data-fieldtype="Currency"]');
                                            // Check if the rateField element exists and apply red color
                                            if (rateField.length > 0) {
                                                rateField.css("color", "red");
                                            }
                                        }
                                    }
                                }
                            }); //frappe.call for item price
                        }
                    }
                }); //frappe.call for item information
            } // if (d.pos % 10 === 0)
        }); // $.each loop
    }
});

frappe.ui.form.on('Quotation Item', {
    //Associate a function with the item_code field change event
    item_code: function(frm, cdt, cdn) {
        // Call the highlight_older_item_price function when the item_code field changes
        frm.events.highlight_older_item_price(frm);
    },
    
    // Attach a function to the items_add event
    items_add: function(frm, cdt, cdn) {
        // Call the highlight_older_item_price function when an item is added
        frm.events.highlight_older_item_price(frm);
    },
    
});

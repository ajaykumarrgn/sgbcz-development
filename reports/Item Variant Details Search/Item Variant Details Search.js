// Add the chosen item code from here to both the sales order item and quotation item. #(TASK-2024-00217)

frappe.query_reports["Item Variant Details Search"] = {
    "filters": [
        {
            "reqd": 1,
            "default": "DTTHZ2N",
            "options": "Item",
            "label": __("Item"),
            "fieldname": "item",
            "fieldtype": "Link",
            "get_query": () => {
                return {
                    "filters": {"has_variants": 1}
                }
            }
        },
        {
            "fieldname": "catalog_designs",
            "label": __("Catalog Designs"),
            "fieldtype": "Check",
            "default": false
        },
        // hidden field to hold the value of the row index from the quotation Items child table
        {
            "fieldname": "item_idx",
            "fieldtype": "Int",
            "hidden": 1
        },
        //>>TASK-2024-00217
        {
            "fieldname": "doctype",
            "label": "Document Type",
            "fieldtype": "Link",
            "options": "DocType",
            "hidden": 1
            
        },
        //<< TASK-2024-00217
    ],
    //>> TASK-2024-00217
    onload: async function (report) {
        frappe.open_dialog = function (item_code) {
            //const quotation_route_latest = frappe.route_history.reverse().find(record => record.includes("Form") && record.includes("Quotation"));
            const LA_ROUTE_LATEST = frappe.route_history.reverse().find(record => record.includes("Form") && record.includes(frappe.query_report.filters[3].value)); 
                //console.log('Matching Record', route_latest);
                //Set the route back to the Quotation
            frappe.set_route(LA_ROUTE_LATEST[0], LA_ROUTE_LATEST[1], LA_ROUTE_LATEST[2]);
                // Set the Item code value from the clicked add action to the route options
            frappe.route_options = {
                "item_code": item_code,
                "item_idx": frappe.query_report.filters[2].value,
            };
        }
        
    }
    //<< TASK-2024-00217
};

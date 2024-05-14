frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        // Fetch items from the API
        fnfetchItemsFromAPI(frm);
    }
});

function fnfetchItemsFromAPI(frm) {
    var laItemGroups = ["DTTHZ2N", "RGB", "NEU"];
    // Call the API to get items
    frappe.call({
        "method": "get_item_template",
        "args": {
            "i_item_groups": laItemGroups,
        },
        "callback": function(response) {
            //console.log(response)
            if(response.message){
                // Set options for transformer_type field
                fnsetTransformerTypeOptions(frm, response.message);
            }
          
        }
    });
}

function fnsetTransformerTypeOptions(frm, litems) {
    // Extract items from the dictionary
    var litemNames = litems.name;
    frm.fields_dict.transformer_type.get_query = function(doc, cdt, cdn) {
        return {
            filters: {
                "name": ["in", litemNames]
            }
        };
    };
}

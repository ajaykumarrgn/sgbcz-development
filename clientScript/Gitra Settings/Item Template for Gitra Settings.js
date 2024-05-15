frappe.ui.form.on('Gitra Settings', {
    refresh: function(frm) {
        // Fetch items from the API
        fnfetchItemsFromAPI(frm);

        //hide the xml, cost settings and ip protection tab if the transformer type is not DTTHZ2N
       fnTabManipulation(frm)
    },

    transformer_type(frm){
        //hide the xml, cost settings and ip protection tab if the transformer type is not DTTHZ2N
       fnTabManipulation(frm)
   }
});

function fnTabManipulation(frm){
    var lXmlTab = document.getElementById('gitra-settings-xml_tab-tab')
    var lCostSettingsTab = document.getElementById('gitra-settings-cost_settings_tab-tab')
    var lIpProtectionTab = document.getElementById('gitra-settings-ip_protection_tab-tab')

     //hide the xml, cost settings and ip protection tab if the transformer type is not DTTHZ2N
   if(frm.doc.transformer_type != 'DTTHZ2N'){
      
       lXmlTab.hidden = true          
       lCostSettingsTab.hidden = true          
       lIpProtectionTab.hidden = true
   }else{
       
       lXmlTab.hidden = false
       lCostSettingsTab.hidden = false         
       lIpProtectionTab.hidden = false
   }
}

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

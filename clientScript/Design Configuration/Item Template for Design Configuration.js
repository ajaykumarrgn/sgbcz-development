frappe.ui.form.on('Design Configuration', {
    factory: function(frm) {
        // Fetch items from the API
        fnfetchItemsFromAPI(frm);

        //hide the xml, cost settings and ip protection tab 
        //if the transformer type is not DTTHZ2N
    //   fnTabManipulation(frm);

        // Use is_default event to check the Design Configuration of the factory already has Transformer Type as is_default
        // Use frappe.get_value with filter "factory = frm.doc.factory, is_default = 1"; if value present throw popup; else return
    },

    is_default: function(frm) {
        if (frm.doc.is_default && frm.doc.factory) {
            frappe.db.get_value('Design Configuration', {
                factory: frm.doc.factory,
                is_default: 1
            }, 'name').then(r => {
                if (r && r.message && r.message.name && r.message.name !== frm.doc.name) {
                    frappe.msgprint(__('A default Design Configuration already exists for this Factory: ') + r.message.name);
                    frm.set_value('is_default', 0);
                }
            });
        }
    }

//     transformer_type(frm){
//         //hide the xml, cost settings and ip protection tab 
//         //if the transformer type is not DTTHZ2N
//       fnTabManipulation(frm);
//   }
});

//XML, Cost Setting and Ip protection tab
//is only for DTTHZ2N Transformer

// function fnTabManipulation(frm){
//     var lXmlTab = document.getElementById('gitra-settings-xml_tab-tab');
//     var lCostSettingsTab = document.getElementById('gitra-settings-cost_settings_tab-tab');
//     var lIpProtectionTab = document.getElementById('gitra-settings-ip_protection_tab-tab');

//      //hide the xml, cost settings and ip protection tab 
//      //if the transformer type is not DTTHZ2N
//   if(frm.doc.transformer_type != 'DTTHZ2N'){
      
//       lXmlTab.hidden = true;         
//       lCostSettingsTab.hidden = true;          
//       lIpProtectionTab.hidden = true;
//   }else{
       
//       lXmlTab.hidden = false;
//       lCostSettingsTab.hidden = false;         
//       lIpProtectionTab.hidden = false;
//   }
   
// }

function fnfetchItemsFromAPI(frm) {
    if (!frm.doc.factory) return;

    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Factory",
            name: frm.doc.factory
        },
        callback: function(response) {
            if (response.message) {
                const itemTemplateRows = response.message.item_template || [];

                // Store all child row values into one array
                const itemTemplateArray = itemTemplateRows.map(row => row.item_template);

                // Set options for transformer_type field
                fnsetTransformerTypeOptions(frm, itemTemplateArray);
            }
        }
    });
}

function fnsetTransformerTypeOptions(frm, laitems) {
    frm.fields_dict.transformer_type.get_query = function(doc, cdt, cdn) {
        return {
            filters: {
                "name": ["in", laitems]
            }
        };
    };
}

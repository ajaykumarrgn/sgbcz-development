frappe.ui.form.on("Design", {
  //Function to toggle design field for story >>US-2025-0602
  transformer_type(frm) {
    fnToggleIsDesignField(frm);  
  },
  factory(frm) {
        //design creation is only for sgbcz transformer to
        //restrict it in other region by hidding the is_design checkbox
        //Commented for story >>US-2025-0602
        // if (frm.doc.factory != 'SGBCZ') {
        //     frm.set_value('is_design', 0);
        //     frm.set_df_property('is_design', 'hidden', 1);
        // } else {
        //      frm.set_df_property('is_design', 'hidden', 0);
        // }
        //<<US-2025-0602
        fnToggleIsDesignField(frm);
        fnFetchTransformerType(frm);
        fnDirectMaterial(frm);
   },
 
 
  refresh(frm) {  
       //design creation is only for sgbcz transformer to
        //restrict it in other region by hidding the is_design checkbox
        
        //Commented for story >>US-2025-0602
        // if (frm.doc.factory != 'SGBCZ') {
        //   frm.set_df_property('is_design', 'hidden', 1);
        // } else {
        //   frm.set_df_property('is_design', 'hidden', 0);
        // }
        //<<US-2025-0602
        fnToggleIsDesignField(frm);
        fnFetchTransformerType(frm);
        if(frm.is_new()){
           fnDirectMaterial(frm);
        }
 
    },
 
  //when is_design checkbox is enabled
    //display only create design button
    is_design(frm) {
        // Update button whenever the checkbox is enabled
       //  fnUpdateButtonGroup(frm);
        fnDirectMaterial(frm);
        fnXMLDataTab(frm);
 
    },
 
  status(frm) {
     fnDirectMaterial(frm);
   },
    
 });
 
 function fnXMLDataTab(frm){
     //restrict XML Data tab for other region except SGBCZ
        
    var lXmlDataTab = document.getElementById('design-xml_data_tab-tab');
        
    if (frm.doc.factory === "SGBCZ" && frm.doc.is_design === 1) {
         lXmlDataTab.hidden = false;
       
    } else {
         lXmlDataTab.hidden = true;
         frm.doc.gitra_xml = '';
    }
 }
 
 function fnFetchTransformerType(frm) {
   if(frm.doc.factory){
     fnXMLDataTab(frm);
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
                    const itemTemplateArray = itemTemplateRows.map(row => row.item_template); // adjust field name as needed
    
                    // Set options for transformer_type field
                    frm.fields_dict.transformer_type.get_query = function(doc, cdt, cdn) {
                    return {
                        filters: {
                            "name": ["in", itemTemplateArray]
                        }
                    };
                };
                }
            }
        });
    }
   //Commented for story >>US-2025-0602
        //  //calling the get_item_variant_based_on_factory
        //     //to get the list of item template available for the
        //     //selected factory
                     
        //      fnXMLDataTab(frm);
        //     //Mapped the factory with its relevant item group
        //     const LD_TRANSFORMER_MAPPING = {
        //         "SGBCZ": "DTTHZ2N",
        //         "RGB": "RGB",
        //         "NEU": "NEU"
        //     };
                
        //     const GET_ITEM_GROUP = LD_TRANSFORMER_MAPPING[frm.doc.factory];
         
        //     frappe.call({
        //         method: "get_item_variant_based_on_factory",
        //         args: { "factory": GET_ITEM_GROUP },
        //         callback: function(response) {
        //             if (response.message) {
        //                 //commented for 602 for linking transformer type
        //                 // set_field_options('transformer_type', response.message);
                       
        //             }
        //         }
        //     });
    //<<US-2025-0602
 }
 
 function fnDirectMaterial(frm){
    // To create item without gitra calculation for SGBCZ, direct material cost
    // is required, so on draft status with is_design checkbox disable make
    // direct material cost mandatory
    // and for all other factory make it non mandatory but editable
    switch (true) {
       case (frm.doc.factory === 'SGBCZ' && !frm.doc.is_design && frm.doc.status === 'Draft'):
           frm.set_df_property('direct_material_cost', 'read_only', 0);
           frm.set_df_property('direct_material_cost', 'reqd', 1);
           break;
       case (frm.doc.factory === 'SGBCZ' && frm.doc.is_design && frm.doc.status === 'Draft'):
           frm.set_df_property('direct_material_cost', 'read_only', 1);
           frm.set_df_property('direct_material_cost', 'reqd', 0);
           break;
       default:
           frm.set_df_property('direct_material_cost', 'read_only', 0);
           frm.set_df_property('direct_material_cost', 'reqd', 0);
           break;
   }
    
 }
 //Function to handle is_design field for story >>US-2025-0602
 function fnToggleIsDesignField(frm) {
  if (!frm.doc.transformer_type) return;

  frappe.db.get_value("Item", frm.doc.transformer_type, "custom_external_design_allowed")
    .then(r => {
      const allowed = r.message.custom_external_design_allowed;
      // Hide is_design field if external_design_allowed is not enabled
      frm.set_df_property("is_design", "hidden", !allowed);
    });
    if (frm.doc.factory != 'SGBCZ') {
            frm.set_value('is_design', 0);
    }
}
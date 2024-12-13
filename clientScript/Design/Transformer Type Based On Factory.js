frappe.ui.form.on("Design", {
  
  factory(frm) {
        //design creation is only for sgbcz transformer to
        //restrict it in other region by hidding the is_design checkbox
           
        if (frm.doc.factory != 'SGBCZ') {
            frm.set_value('is_design', 0);
            frm.set_df_property('is_design', 'hidden', 1);
        } else {
             frm.set_df_property('is_design', 'hidden', 0);
        }
        fnFetchTransformerType(frm);
        fnDirectMaterial(frm);
   },
 
 
  refresh(frm) {  
       //design creation is only for sgbcz transformer to
        //restrict it in other region by hidding the is_design checkbox
        
        if (frm.doc.factory != 'SGBCZ') {
           frm.set_df_property('is_design', 'hidden', 1);
        } else {
           frm.set_df_property('is_design', 'hidden', 0);
        }
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
        
    if (frm.doc.factory === "SGBCZ" && frm.doc.is_design) {
         lXmlDataTab.hidden = false;
       
    } else {
         lXmlDataTab.hidden = true;
         frm.doc.gitra_xml = '';
    }
 }
 
 function fnFetchTransformerType(frm) {
 
 //calling the get_item_variant_based_on_factory
    //to get the list of item template available for the
    //selected factory
             
     fnXMLDataTab(frm);
    //Mapped the factory with its relevant item group
    const LD_TRANSFORMER_MAPPING = {
        "SGBCZ": "DTTHZ2N",
        "RGB": "RGB",
        "NEU": "NEU"
    };
        
    const GET_ITEM_GROUP = LD_TRANSFORMER_MAPPING[frm.doc.factory];
 
    frappe.call({
        method: "get_item_variant_based_on_factory",
        args: { "factory": GET_ITEM_GROUP },
        callback: function(response) {
            if (response.message) {
                set_field_options('transformer_type', response.message);
               
            }
        }
    });
 
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
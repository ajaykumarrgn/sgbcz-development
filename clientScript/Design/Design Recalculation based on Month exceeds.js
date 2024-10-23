frappe.ui.form.on("Design", {
  onload(frm) {
       
       // For backward compatibility:
       // Designs created before adding the factory option.
       // If the status is 'Calculation Received', set:
       // Factory: 'SGBCZ'
       // Transformer Type: 'DTTHZ2N'
       fncheckRecalculateDesign(frm);
       if(!frm.is_new()){
           if (frm.doc.status === 'Calculation Received' && 
           (!frm.doc.factory || !frm.doc.transformer_type)) {
               fnUpdateButtonGroup(frm);
           }
       }  
   },

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
       fnUpdateButtonGroup(frm);
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
       fnUpdateButtonGroup(frm);
       fncheckRecalculateDesign(frm);
       if(frm.is_new()){
           fnDirectMaterial(frm);
       }

   },

 
 //when is_design checkbox is enabled
   //display only create design button
   is_design(frm) {
       // Update button whenever the checkbox is enabled
       fnUpdateButtonGroup(frm);
       fnDirectMaterial(frm);
       fnXMLDataTab(frm);

   },

 status(frm) {
     
       // Update button whenever the status field changes
       fnUpdateButtonGroup(frm);
       fnDirectMaterial(frm);
   },
   
   // If the user removes the value in the item field,
   // the status will be changed based on whether the 
   //item was created from design (with gitra calculation)
   // or without gitra calculation.

  item(frm){
        if(!frm.doc.item && frm.doc.status === "Item Created"){
            if(frm.doc.is_design === 1){
                frm.set_value('status', 'Calculation Received');
                frm.save().then(function() {
                    fnUpdateButtonGroup(frm);
                });
            }else{
                frm.set_value('status', 'Draft');
                frm.save().then(function() {
                    fnUpdateButtonGroup(frm);
                });
            }
        }
    }
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

function fnUpdateButtonGroup(frm) {
  const STATUS = frm.doc.status;
  const LA_BUTTONS = [];

  // Determine which buttons to show based on status
  if (STATUS === 'Draft' && frm.doc.is_design === 1) {
    LA_BUTTONS.push({
          label: 'Create Design',
          action: fncreateDesign
      });
  }

  if (STATUS === 'Draft' && frm.doc.is_design === 0) {
    LA_BUTTONS.push({
          label: 'Create Item',
          action: fncreateItem
      });
  }

  if (STATUS === 'Calculation Received' && !frm.doc.item) {
    LA_BUTTONS.push({
                      label: 'Recalculate Design',
                      action: fnRecalculate
                  });
    
    LA_BUTTONS.push({
          label: 'Create Item',
          action: fncreateItem
      });
      
    }

  if (STATUS === 'Item Created' && frm.doc.item) {
    LA_BUTTONS.push({
                      label: 'Recalculate Design',
                      action: fnRecalculate
                  });
    
    LA_BUTTONS.push({
          label: 'View Item',
          action: fnviewItem
      });
  }

  if (STATUS === 'Item Created' && !frm.doc.item) {
    LA_BUTTONS.push({
          label: 'Create Item',
          action: fncreateItem
      });
  }
  if(STATUS === 'Calculation Received' && frm.doc.item){
    frm.set_value('status', 'Item Updated')
  }
  if(STATUS === 'Item Updated' && frm.doc.factory == 'SGBCZ'){
      
    LA_BUTTONS.push({
                      label: 'Recalculate Design',
                      action: fnRecalculate
                  });
        LA_BUTTONS.push({
          label: 'Update Pricelist',
          action: fnUpdatePricelist
      });
      LA_BUTTONS.push({
          label: 'View Item',
          action: fnviewItem
      });
  }
  // Pass the button array to the fnShowButtonGroup function
  fnShowButtonGroup(frm, LA_BUTTONS);
}

// Function to show or hide multiple buttons
function fnShowButtonGroup(frm, iaButtonArray) {
// Clear all custom buttons
  if(frm.doc.status != 'Item Updated'){
    frm.clear_custom_buttons();
  }

if (Array.isArray(iaButtonArray)) {
  iaButtonArray.forEach(function(idButton) {
        const { label, action } = idButton;
        if (label && action) {   
            // Add the custom button
            const BUTTON = frm.add_custom_button(__(label), function() {
                if (!frm.is_dirty()) {
                    action(frm);
                }
            });
          //   Ensure the button is enabled/disabled based on form dirty state
            if (frm.is_dirty()) {
                $(BUTTON).prop('disabled', true).css('pointer-events', 'none');
            } else {
                $(BUTTON).prop('disabled', false).css('pointer-events', 'auto');
            }
        }
    });   
  }
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

function fncheckRecalculateDesign(frm) {
  frappe.model.with_doc("Quotation Presets", "Quotation Presets", function() {
      let ldDoc = frappe.model.get_list("Quotation Presets");
      const refreshDate = ldDoc[0].price_recalculation_frequency;
      const today = new Date();
      const lastCalculateDate = frm.doc.last_calculated_on ? new Date(frm.doc.last_calculated_on) : null;

      if (refreshDate && lastCalculateDate) {
          const timeDiff = Math.abs(today - lastCalculateDate);
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

          if (dayDiff >= refreshDate) {
              const buttons = [];

              if (frm.doc.status == 'Calculation Received' && !frm.doc.item) {
                  frm.set_intro(false);
                  frm.set_intro(__('The calculation is expired by ') + dayDiff + " days from default price recalculation frequency", 'yellow');

                  buttons.push({
                      label: 'Recalculate Design',
                      action: fnRecalculate
                  });
              }

              if (frm.doc.status == 'Item Created') {
                  frm.set_intro(false);
                  frm.set_intro(__('The calculation is expired by ') + dayDiff + " days from default price recalculation frequency", 'yellow');
  
                  buttons.push({
                      label: 'Recalculate Design',
                      action: fnRecalculate
                  });
                  buttons.push({
                      label: 'View Item',
                      action: fnviewItem
                  });
              }

              // Pass the button array to the function
              fnShowButtonGroup(frm, buttons);
          }
      }
  });
}

function fnRecalculate(frm){
 // Clear all the specified fields
  const fieldsToClear = [
    'upstream_file',
    'gitra_xml',
    'gitra_xml_downstream',
    'gitra_json_downstream',
    'direct_material_cost'
  ];

  // Set all fields to empty string
  fieldsToClear.forEach(field => frm.set_value(field, ''));

  // Update the status and save the form
  frm.set_value("status", "Perform Calculation");
  frm.save();

}

function fnUpdatePricelist(frm) {
  console.log("updated the price list");

    frappe.call({
        method: 'update_price_rate_on_design_item',
        args: {
          i_item_code: frm.doc.item,
          i_design_id: frm.doc.name
        },
        callback: function(response) {
          if (response.message) {
            console.log('API response:', response.message);
          } else {
            console.log('No response from API.');
          }
        },
    })
}

function fncreateItem(frm) {
  //the Item will be created if no load and load loss
  //guarantee is not empty
  if(frm.doc.no_load_loss_guarantee && frm.doc.load_loss_guarantee
    && parseInt(frm.doc.lwa) >= 0 && parseInt(frm.doc.lpa) >= 0 && 
    !(parseInt(frm.doc.lwa) === 0 && parseInt(frm.doc.lpa) === 0)
  ){

    //Start of item creation
    frappe.msgprint(__('The item is being created. Please wait a moment.'));
    //Calling the create_item_from_design_beta api
    frappe.call({
      method: "create_item_from_design_beta",
      args: { design: frm.doc.name },
      callback: function (response) {
        if (response.message) {

          //after successfull creation
          //an alert message
          frappe.show_alert(
            { message: __("Item Created"), indicator: "green" },
            5
          );
          //setting the item field
          frm.set_value("item", response.message.item_code);
          frm.set_value("status", "Item Created");
          frm.refresh_fields();
          //pdf creation is enabled for
          //is design SGBCZ transformer
          frm.save().then(() => {
            if (frm.doc.is_design === 1) {
              frappe.show_progress(
                __("Creating with Pdf.."),
                50,
                100,
                __("Please wait")
              );
              //get the languange and separator
              //from gitra settings
              frappe.call({
                method: "frappe.client.get",
                args: { doctype: "Gitra Settings" },
                callback: function (gitraResponse) {
                  if (gitraResponse.message) {
                    const LD_DATASHEETLANGUAGES =
                      gitraResponse.message.datasheet_languages;
                    const LA_LANGUAGES = LD_DATASHEETLANGUAGES.map(
                      (lang) => lang.language
                    );
                    //the filename is generated using the argument
                    // im_file_name, which takes a string 
                    //that includes a placeholder for language.
                    // Example:'Datasheet_${l_title}_${frm.doc.name}_{language}'
                    // Here, {language} is the placeholder, 
                    //ensuring the language appears at the end.
                                        
                    // The design title will be used as the filename.
                    let lTitle = frm.doc.title;
                    if (lTitle) {
                      // Find the position of the first space
                      let lSpaceIndex = lTitle.indexOf(" ");
                      if (lSpaceIndex !== -1) {
                        // Remove everything up to the first space
                        lTitle = lTitle.substring(lSpaceIndex + 1);
                      }
                       // Replace slashes with gitra separator
                      lTitle = lTitle.replace(
                        /\//g,
                        gitraResponse.message.naming_separator
                      );
                    }

                    //calling the custom fn_doc_pdf_source_to_target
                    //developed inside the framework
                    frappe.call({
                      method: "pdf_on_submit.api.fn_doc_pdf_source_to_target",
                      args: {
                        im_source_doc_type: frm.doc.doctype,
                        im_source_doc_name: frm.doc.name,
                        im_languages: LA_LANGUAGES,
                        im_letter_head: "Data Sheet",
                        im_target_doc_type: "Item",
                        im_target_doc_name: response.message.item_code,
                        im_file_name: `Datasheet_${lTitle}_${frm.doc.name}_{language}`,
                      },
                      callback: function (pdfResponse) {
                        if (pdfResponse.message) {
                          //update the status
                          frappe.hide_progress();
                          frm.set_value('status', 'Item Created');
                          frm.save().then(() => {
                            fnUpdateButtonGroup(frm);
                          });
                        }
                      },
                    });
                  }
                },
              });
            } else {
              fnUpdateButtonGroup(frm);
            }
          });
        } else {
          frappe.show_alert(
            { message: __("Error Creating Item"), 
              indicator: "red" },
            5
          );
        }
      },
    });
  }else{
   frappe.msgprint(__((!frm.doc.no_load_loss_guarantee ? "No Load Loss Guarantee " : "") + 
   (!frm.doc.load_loss_guarantee ? "Load Loss Guarantee " : "") + (!(parseInt(frm.doc.lwa) >= 0) ? "Lwa " : "") + 
   (!(parseInt(frm.doc.lpa) >= 0) ? "Lpa " : "") + 
   (parseInt(frm.doc.lwa) === 0 && parseInt(frm.doc.lpa) === 0 ? "Lpa (0) and Lwa (0) " : "")  + "cannot be empty for creating an item"));
  }
}

function fncreateDesign(frm) {
 frm.set_value("status", "Perform Calculation");
 frm.save();
}

function fnviewItem(frm) {
 frappe.set_route("item", frm.doc.item);
}

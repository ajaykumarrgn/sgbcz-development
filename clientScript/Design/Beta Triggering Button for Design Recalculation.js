  // Issues
  // Recalculate design button appearing for non designs (ISS-2025-00030)
  // Disable the Create Item Button when Duplicate exists (ISS-2025-00029)
  frappe.ui.form.on("Design", {
    onload(frm) {
    // For backward compatibility: Designs created
    // before adding the factory option.
    // If the status is 'Calculation Received', Factory: 'SGBCZ'
    // Transformer Type: 'DTTHZ2N'
    fnCheckRecalculateDesign(frm);
      if(!frm.is_new()){
        if (frm.doc.status === 'Calculation Received' && 
        (!frm.doc.factory || !frm.doc.transformer_type)) {
            fnUpdateButtonGroup(frm);
        }
      }  
    },
  
    factory(frm) {
      fnUpdateButtonGroup(frm);
    },
  
    refresh(frm) { 
      if (!frm.is_new() && frm.doc.status === 'Draft') {
        // Check if the item already exists when the form is not new
        // by using the "GET" method (>>ISS-2025-00029)
        frappe.call({
            method: "beta_create_item_from_design",
            args: { i_design: frm.doc.name, i_method: "GET" },
            callback: function (ldResponse) {
              if (ldResponse.message) {
                // If duplicate item exist, disable the Create Item button 
                // as well as hide the "Recalculate Design" button
                if (ldResponse.message === 'Item already exists') {
                    // Disable the Create Item button and make it readonly if item already exists
                    var lCreateItemButton = __("Create Item");// Disable the "Create Item" button
                    var lRecalculateButton = __("Recalculate Design"); //Disable the "Recalculate Design" button
                    $("button:contains('" + lCreateItemButton + "')").prop('disabled', true).css('pointer-events', 'none');
                    $("button:contains('" + lRecalculateButton + "')").prop('disabled', true).css('pointer-events', 'none').hide();
                
                } 
              }
            }
        });
      } //(<<ISS-2025-00029)
      fnUpdateButtonGroup(frm);
      fnCheckRecalculateDesign(frm);
    },
  
    //when is_design checkbox is enabled
    //display only create design button
    is_design(frm) {
      // Update button whenever the checkbox is enabled
      fnUpdateButtonGroup(frm);
    },
  
    status(frm) {
      // Update button whenever the status field changes
      fnUpdateButtonGroup(frm);
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
  
  function fnUpdateButtonGroup(frm) {
    const L_STATUS = frm.doc.status;
    const LA_BUTTONS = [];  
    // Determine which buttons to show based on status
    if (L_STATUS === 'Draft' && frm.doc.is_design === 1) {
      LA_BUTTONS.push({
            L_LABEL: __('Create Design'),
            L_ACTION: fnCreateDesign
        });
    }
    if (L_STATUS === 'Draft' && frm.doc.is_design === 0) {
      LA_BUTTONS.push({
            L_LABEL: __('Create Item'),
            L_ACTION: fnCreateItem
        });
    }
    if (L_STATUS === 'Calculation Received' && !frm.doc.item) {
      LA_BUTTONS.push({
            L_LABEL: __('Recalculate Design'),
            L_ACTION: fnRecalculate
          });
      LA_BUTTONS.push({
            L_LABEL: __('Create Item'),
            L_ACTION: fnCreateItem
        });      
      }
    // Previously, Recalculate button was visible for all factories.
    // Now it only shows for SGBCZ is-design factory.
    if (L_STATUS === 'Item Created' && frm.doc.item && frm.doc.is_design === 1) { //<<ISS-2025-00030
      LA_BUTTONS.push({
                        L_LABEL: __('Recalculate Design'),
                        L_ACTION: fnRecalculate
                    });    
      LA_BUTTONS.push({
            L_LABEL: __('View Item'),
            L_ACTION: fnViewItem
        });
    }
     //>>ISS-2025-00030
    //Display View button when item is created, but only for non-design items
    if (L_STATUS === 'Item Created' && frm.doc.item) {
      LA_BUTTONS.push({
        L_LABEL: __('View Item'),
        L_ACTION: fnViewItem
      });
    }
    //<<ISS-2025-00030
    if (L_STATUS === 'Item Created' && !frm.doc.item) {
      LA_BUTTONS.push({
            L_LABEL: __('Create Item'),
            L_ACTION: fnCreateItem
        });
    }
    if(L_STATUS === 'Calculation Received' && frm.doc.item){
      frm.set_value('status', 'Item Recalculated');
      frm.save();
    }
    // After recalculation, the design transitions 
    // to the "Item Recalculated" state (ISS-2025-00030)
    if (L_STATUS === 'Item Recalculated' && frm.doc.factory === 'SGBCZ') {
      LA_BUTTONS.push({
        L_LABEL: __('Recalculate Design'),
        L_ACTION: fnRecalculate
      });
      // Only show the button if the checkbox is not checked
      if (frm.doc.is_update_item_prices !== 1) {
        LA_BUTTONS.push({
          L_LABEL:  __('Force Update Pricelist'),
          L_ACTION: fnUpdatePricelist
        });
      }
      LA_BUTTONS.push({
        L_LABEL:  __('View Item'),
        L_ACTION: fnViewItem
      });
    }
    // Show the buttons after updating the prices 
    // into pricelist (ISS-2025-00030)
    if (L_STATUS === 'Item Updated' && frm.doc.factory === 'SGBCZ') {
      LA_BUTTONS.push({
        L_LABEL:  __('Recalculate Design'),
        L_ACTION: fnRecalculate
      });
      LA_BUTTONS.push({
        L_LABEL:  __('View Item'),
        L_ACTION: fnViewItem
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
          const { L_LABEL, L_ACTION } = idButton;
          if (L_LABEL && L_ACTION) {   
              // Add the custom button
              const L_BUTTON = frm.add_custom_button(__(L_LABEL), function() {
                  if (!frm.is_dirty()) {
                      L_ACTION(frm);
                  }
              });
            // Ensure the button is enabled/disabled based on form dirty state
              if (frm.is_dirty()) {
                $(L_BUTTON).prop('disabled', true).css('pointer-events', 'none');
              } else {
                $(L_BUTTON).prop('disabled', false).css('pointer-events', 'auto');
              }
          }
      });   
    }
  }
  
  //Get the list of quotation preset with the design recalculated frequency
  function fnCheckRecalculateDesign(frm) {
  frappe.model.with_doc("Quotation Presets", "Quotation Presets", function() {
      let laDoc = frappe.model.get_list("Quotation Presets");
      const L_REFRESHDATE = laDoc[0].price_recalculation_frequency;
      const L_TODAY = new Date();
      const L_LASTCALCULATEDATE = frm.doc.last_calculated_on ? new Date(frm.doc.last_calculated_on) : null;
      if (L_REFRESHDATE && L_LASTCALCULATEDATE) {
          const L_TIMEDIFF = Math.abs(L_TODAY - L_LASTCALCULATEDATE);
          const L_DAYDIFF = Math.ceil(L_TIMEDIFF / (1000 * 3600 * 24));
          if (L_DAYDIFF >= L_REFRESHDATE) {
              const LA_BUTTONS = [];
              if (frm.doc.status == 'Calculation Received' && !frm.doc.item) {
                  frm.set_intro(false);
                  frm.set_intro(__('The calculation is expired by ') + L_DAYDIFF + __(' days from default price recalculation frequency'), 'yellow');
                  LA_BUTTONS.push({
                      L_LABEL:  __('Recalculate Design'),
                      L_ACTION: fnRecalculate
                  });
              }
              if (frm.doc.status == 'Item Created') {
                  frm.set_intro(false);
                  frm.set_intro(__('The calculation is expired by ') + L_DAYDIFF + __(' days from default price recalculation frequency'), 'yellow');
                  LA_BUTTONS.push({
                      L_LABEL:  __('Recalculate Design'),
                      L_ACTION: fnRecalculate
                  });
                  LA_BUTTONS.push({
                      L_LABEL:  __('View Item'),
                      L_ACTION: fnViewItem
                  });
              }
              // Pass the button array to the function
              fnShowButtonGroup(frm, LA_BUTTONS);
            }
          }
      });
  }
  
  function fnRecalculate(frm){
  // Clear all the specified fields
  // In order to gitra calculation, should clear the fields 
  // upstream file, Gitra XML downstream, Gitra json Downstream
  // from the xml data tab and labour and direct material cost 
  // from the item tab for calculating total cost.
  // Get the confirmation from the user for recalculating the design price
    frappe.confirm(
      __('This will Recalculate the Price for the Design again. Do you want to proceed?'),
      function() {
        // If 'Yes', proceed with recalculation
        const LA_FIELDSTOCLEAR = [
          'upstream_file', 'gitra_xml_downstream', 'labour',
          'gitra_json_downstream', 'direct_material_cost'
        ];
        // Set all fields to empty string
        LA_FIELDSTOCLEAR.forEach(field => frm.set_value(field, ''));
        frm.set_value('is_update_item_prices', 0);
        // Update the status and save the form
        frm.set_value("status", "Perform Calculation");
        frm.save();
        },
        function() {
        // If 'No', skip recalculation
      }
    );
  }
  
  function fnUpdatePricelist(frm) {
    // Fetch the override price field from the Item doctype for the selected item
    frappe.db.get_value('Item', frm.doc.item, 'override_price')
      .then(ldResponse => {
        const L_OVERRIDEPRICE = ldResponse.message.override_price;
        // update the price rate
        const L_UPDATEPRICE = () => {
          frappe.call({
            method: 'update_price_rate_on_design_item',
            args: {
              i_item_code: frm.doc.item,
              i_design_id: frm.doc.name
            },
            callback: function(ldResponse) {
              if (ldResponse.message) {
                  //Once price is updated fot that item into the price list
                  frm.set_value('is_update_item_prices', 1); 
                  // After updating the price, set the status into Item Updated
                  // ISS-2025-00030
                  frm.set_value('status', 'Item Updated');
                  frm.save();                
              }
            }
          });
        };
  
        // If override_price is found, show confirmation
        // dialog for proceeding the further step
        if (L_OVERRIDEPRICE) {
          frappe.confirm(
            __('Item Price Override is Enabled. Do you want to proceed with updating the prices in the Price list?'),
            function () {
              // Yes: Proceed with updating prices
              L_UPDATEPRICE(); // Call the function to update prices
              frappe.msgprint(__('Price list rates updated successfully.'));
            }, 
            function() {   // If 'No', show cancellation message
              frappe.msgprint(__('Pricelist update cancelled'));
            }
          );
        } else {
          // If no override_price, update directly
          L_UPDATEPRICE();
          frappe.msgprint(__("Price list rates updated successfully."));
        }
      });
  }
  
  function fnCreateItem(frm) {
    //the Item will be created if no load and load loss
    //guarantee is not empty
    if(frm.doc.no_load_loss_guarantee && frm.doc.load_loss_guarantee
      && parseInt(frm.doc.lwa) >= 0 && parseInt(frm.doc.lpa) >= 0 && 
      !(parseInt(frm.doc.lwa) === 0 && parseInt(frm.doc.lpa) === 0)
    ){
    //Start of item creation
    // frappe.msgprint(__('The item is being created. Please wait a moment.'));
    frappe.show_alert(
      { message: __("The item is being created. Please wait a moment."), indicator: "green" },
      3
    );
    //Calling the create_item_from_design api
    frappe.call({
      method: "beta_create_item_from_design",
      args: { i_design: frm.doc.name , i_method: 'POST'},
      callback: function (ldResponse) {
        if (ldResponse.message) {
          //after successfull creation displays the alert message
          frappe.show_alert(
            { message: __("Item Created"), indicator: "green" },
            5
          );
          //setting the item field
          frm.set_value("item", ldResponse.message.item_code);
          frm.set_value("status", "Item Created");
          frm.refresh_fields();
          //pdf creation is enabled for "is design" SGBCZ transformer
          frm.save().then(() => {
            if (frm.doc.is_design === 1) {
              frappe.show_progress(
                __("Creating with Pdf.."),
                50,
                100,
                __("Please wait")
              );
              //get the languange and separator from Quotation Presets for story >>US-2025-0603
              frappe.call({
                method: "frappe.client.get",
                args: { doctype: "Quotation Presets"       
                 },
                callback: function (ldGitraResponse) { 
                  if (ldGitraResponse.message) {
                    const LD_DATASHEETLANGUAGES =
                      ldGitraResponse.message.datasheet_languages;
                    const LA_LANGUAGES = LD_DATASHEETLANGUAGES.map(
                      (ldlanguage) => ldlanguage.language
                    );
                    //the filename is generated using the argument
                    // im_file_name, which takes a string 
                    //that includes a placeholder for language.
                    // Example:'Datasheet_${l_title}_${frm.doc.name}_{language}'
                    // Here, {language} is the placeholder, 
                    // ensuring the language appears at the end.                                      
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
                        ldGitraResponse.message.naming_separator
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
                        im_target_doc_name: ldResponse.message.item_code,
                        im_file_name: `Datasheet_${lTitle}_${frm.doc.name}_{language}`,
                      },
                      callback: function (ldPdfResponse) {
                        if (ldPdfResponse.message) {
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
  
  //Enable the create design button and also 
  // set the status when design in draft mode.
  function fnCreateDesign(frm) {
    frm.set_value("status", "Perform Calculation");
    frm.save();
  }
  
  //When clicking the View Item and it redirects to the item form
  function fnViewItem(frm) {
    frappe.set_route("item", frm.doc.item);
  }
  
  
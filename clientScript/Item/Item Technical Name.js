//Change Reference
//Both HV1 and HV2. 1 and 2 as Subscript (Issue: ISS-2024-00017)
frappe.ui.form.on('Item', {
	refresh(frm) {
	    
	},
    validate(frm){
 	    let lItemTechnicalName;
 	    // Function to format the HV text based on attribute values
 	    function fget_hv(iDoc) {
 	        var lhv_text = "";
	        // Find the index of the attribute "HV (kV)"
 	        let lIndex = iDoc.attributes.findIndex(element => element.attribute=="HV (kV)");
 	        // If "HV (kV)" is not available, try "HV 1 (kV)" and "HV 2 (kV)"
     	    if (!iDoc.attributes[lIndex].attribute_value) {
     	        // Find the index of the attribute "HV 1 (kV)"
     	        lIndex = iDoc.attributes.findIndex(element => element.attribute=="HV 1 (kV)");
     	        
     	        //>>ISS-2024-00017
     	        //Replace the HV1 as HV₁ 
     	        lhv_text = 'HV₁ ' + (iDoc.attributes[lIndex].attribute_value).toString().replace(/\./g, ",") + ' [kV]';
     	        
     	        // Find the index of the attribute "HV 2 (kV)"
     	        lIndex = iDoc.attributes.findIndex(element => element.attribute=="HV 2 (kV)");
     	        
     	        //Replace the HV2 as HV₂ 
     	        lhv_text = lhv_text + ', ' + 'HV₂ ' + (iDoc.attributes[lIndex].attribute_value).toString().replace(/\./g, ",") + ' [kV]';
     	        //<<ISS-2024-00017
     	        
     	       
     	    } else {
     	        // If "HV (kV)" is available, use it
     	        lhv_text = 'HV ' + (iDoc.attributes[lIndex].attribute_value).toString().replace(/\./g, ",") + ' [kV]';
    	            
            } 
     	    return lhv_text;
 	    }
        //>> TASK-2024-0582
        //Funtion to get LV if available or get the LV 1 and LV 2
        function fgeLVwithUk(iDoc) {
            var lLVtext = "";
            // Find index of attribute "LV (V)"
            let lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="LV (V)");
            // If "LV (V)" is not available, try "LV 1 (V)" and "LV 2 (V)"
     	    if (!iDoc.attributes[lIndexvalue].attribute_value) {
                // Find index of attribute "Power LV 1 (KV)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="Power LV 1 (KV)");
                lLVtext = ' Power LV₁ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [kV]';
                // Find index of attribute "LV 1 (V)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="LV 1 (V)");
                lLVtext += ', ' + 'LV₁ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [V]';
                // Find index of attribute "Uk LV 1 (%)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="Uk LV 1 (%)");
                lLVtext += ', ' + 'Uk LV₁ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [%]';
                // Find index of attribute "Power LV 2 (KV)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="Power LV 2 (KV)");
                lLVtext += ', ' + 'Power LV₂ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [kV]';
                // Find index of attribute "LV 2 (V)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="LV 2 (V)");
                lLVtext += ', ' + 'LV₂ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [V]';
                // Find index of attribute "Uk LV 2 (%)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="Uk LV 2 (%)");
                lLVtext += ', ' + 'Uk LV₂ ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [%]';
            } else {
                lLVtext = ' LV ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [V]';
                // Find index of attribute "Uk (%)"
                lIndexvalue = iDoc.attributes.findIndex(element => element.attribute=="Uk (%)");
                lLVtext += ', ' + 'Uk ' + (iDoc.attributes[lIndexvalue].attribute_value).toString().replace(/\./g, ",") + ' [%]';
            }
            return lLVtext;
        
        }
        //<< TASK-2024-0582

        if (frm.is_new()){
        // Check if the item is a variant and starts with "DTTHZ2N"
	       if (frm.doc.variant_of && frm.doc.variant_of.startsWith("DTTHZ2N") ) { 
	           // Find the index of the attribute "Power (kVA)"
    	        let lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Power (kVA)");
    	        // Check if "Power (kVA)" attribute is present
    	        if(lIndex>=0){
    	         
    	            //check if attribute value is filled
    	            if(frm.doc.attributes[lIndex].attribute_value) {
    	                 // Set the item technical name with "Power (kVA)" value
    	                lItemTechnicalName   = (frm.doc.attributes[lIndex].attribute_value).toString() + ' [kVA]';
    	            }
    	        }
        	    //Retrieve the formatted HV values, whether it is 'HV' or a combination of 'HV1' and 'HV2'
                let lhv_text = fget_hv(frm.doc);
                lItemTechnicalName =  lItemTechnicalName + ', ' + lhv_text;
        	         
        	   
        	   // Find index of attribute "LV (V)"
                lIndex = frm.doc.attributes.findIndex(element => element.attribute=="LV (V)");
                // Check if "LV (V)" attribute is present
        	    if(lIndex>=0){
        	        // Add "LV (V)" attribute to the item technical name
        	       lItemTechnicalName   = lItemTechnicalName + ',' + ' LV '  + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [V]';
                 }
                 
                // Find index of attribute "Uk (%)"
                lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Uk (%)");
                // Check if "Uk (%)" attribute is present
        	    if(lIndex>=0){
        	        // Add "Uk (%)" attribute to the item technical name
                    lItemTechnicalName   = lItemTechnicalName + ',' + ' Uk ' + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [%]';
        
        	    }
        	    
        	    // Find index of attribute "P0 (W)"
        	    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="P0 (W)");
        	    // Check if "P0 (W)" attribute is present
        	    if(lIndex>=0){
        	        // Add "P0 (W)" attribute to the item technical name
                    lItemTechnicalName   = lItemTechnicalName + ',' + ' P(0) ' + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [W]';
        
        	    }
        	    
        	    // Find index of attribute "Pk (W)"
        	    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Pk (W)");
        	    // Check if "Pk (W)" attribute is present
        	    if(lIndex>=0){
        	        // Add "Pk (W)" attribute to the item technical name
                    lItemTechnicalName   = lItemTechnicalName + ',' + ' P(k) ' + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [W]';
        	    }
                cur_frm.set_value("item_technical_name", lItemTechnicalName ); 
    	    } 
            // Set the calculated value to the field "item_technical_name"
    	     
    	    
    	     var laItemGroups = ["RGB", "NEU"];
    	     let laTemplate = [];
            // Call the API to get items
            frappe.call({
                "method": "get_item_template",
                "args": {
                    "i_item_groups": laItemGroups
                },
                "callback": function(response) {
                    //console.log(response)
                    if(response.message){
                        // Set options for transformer_type field
                        laTemplate = response.message.name
                        
                    }
                  
                }
            });

            //>> TASK-2024-0582
            // Item Techinacal Name for Template with item group  RGB , NEU
           if (laTemplate.includes(frm.doc.variant_of)) {
                
                    // Find the index of the attribute "Power (kVA)"
                    let lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Power (kVA)");
                    // Check if "Power (kVA)" attribute is present
                    if(lIndex>=0){
                    
                        //check if attribute value is filled
                        if(frm.doc.attributes[lIndex].attribute_value) {
                            // Set the item technical name with "Power (kVA)" value
                            lItemTechnicalName   = (frm.doc.attributes[lIndex].attribute_value).toString() + ' [kVA]';
                        }
                    }

                    //Retrieve the formatted HV values, whether it is 'HV' or a combination of 'HV1' and 'HV2'
                    let lhv_text = fget_hv(frm.doc);
                    lItemTechnicalName =  lItemTechnicalName + ', ' + lhv_text;

                    //Retrieve the formatted LV values, whether it is 'LV' or a combination of 'LV1' and 'LV2'
                    let lLVtext = fgeLVwithUk(frm.doc);
                    lItemTechnicalName = lItemTechnicalName + ', ' + lLVtext;

                    // Find index of attribute "P0 (W)"
                    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="P0 (W)");
                    // Check if "P0 (W)" attribute is present
                    if(lIndex>=0){
                        // Add "P0 (W)" attribute to the item technical name
                        lItemTechnicalName   = lItemTechnicalName + ',' + ' P(0) ' + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [W]';
            
                    }
                    
                    // Find index of attribute "Pk (W)"
                    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Pk (W)");
                    // Check if "Pk (W)" attribute is present
                    if(lIndex>=0){
                        // Add "Pk (W)" attribute to the item technical name
                        lItemTechnicalName   = lItemTechnicalName + ',' + ' P(k) ' + (frm.doc.attributes[lIndex].attribute_value).toString() + ' [W]';
                    }

                    // Find index of attribute "Winding Material"
                    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Winding Material");
                    // Check if "Winding Material" attribute is present
                    if(lIndex>=0){
                        // Add "Winding Material" attribute to the item technical name
                        lItemTechnicalName   = lItemTechnicalName + ', ' + (frm.doc.attributes[lIndex].attribute_value).toString();
            
                    }
                    
                    // Find index of attribute "Cooling"
                    lIndex = frm.doc.attributes.findIndex(element => element.attribute=="Cooling");
                    // Check if "Cooling" attribute is present
                    if(lIndex>=0){
                        // Add "Cooling" attribute to the item technical name
                        lItemTechnicalName   = lItemTechnicalName + ', ' + (frm.doc.attributes[lIndex].attribute_value).toString();
                    }

                    // Set the calculated value to the field "item_technical_name"
    	            cur_frm.set_value("item_technical_name", lItemTechnicalName );           
            }      
            //<< TASK-2024-0582
              
	    }
	},
});

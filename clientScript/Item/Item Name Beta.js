// Change References
// Formation of Enclosure Item Name:(Issue# : ISS-2024-00004)
//Formation of DTTHZ2N Item code Formation: (Issue# : ISS-2024-00013)

cur_frm.cscript.custom_validate = function(doc) {
    // clear item_code (name is from item_code)
    function add_attribute_to_item_name(iDoc, iAttribute){
        // Get the current item_name
        let lItemName = iDoc.item_name;
        
        // Find the index of the attribute in the attributes array
        let lIndex = iDoc.attributes.findIndex(element => element.attribute==iAttribute);
        
        // Handle specific attributes
        switch(iAttribute) {
            case "HV 1 (kV)":
            case "HV 2 (kV)":
            case "HV (kV)":
                
                // If the attribute value is not present, set it to 0
                if (!iDoc.attributes[lIndex].attribute_value) {
                    iDoc.attributes[lIndex].attribute_value = 0;
                }
                break;
            }
        // fill the item attribute only if it has a value
        if(lIndex>=0 && iDoc.attributes[lIndex].attribute_value!==0){
            lItemName   =  lItemName + '/' + (iDoc.attributes[lIndex].attribute_value).toString().replace(/\./g, ",");
        }
        return lItemName;
    }
    // Only for new documents
    if(cur_frm.is_new()) {
        
        var lItemCode  = '';
        // Split the item code using '-' as a separator and store the resulting array in attribute_values
        const attribute_values = doc.item_code.split('-');
       
        // first 2 characters based on item_group
        switch(doc.item_group) {
            case "DTTHZ2N":  
            case "Reduzierte Verluste":
            case "Umschaltbar":
            case "Umschaltbar ECO+":
                doc.item_name = doc.variant_of;
                // Find the index of the "Power (kVA)" attribute in the attributes array
                let lIndex = doc.attributes.findIndex(element => element.attribute=="Power (kVA)");
                // Check if the "Power (kVA)" attribute exists and has a value
        	    if(lIndex>=0){
        	        //check if attribute value is filled
        	       if(doc.attributes[lIndex].attribute_value) {
        	           // Append the "Power (kVA)" attribute value to the item_name
        	            doc.item_name   = doc.item_name  + ' ' + (doc.attributes[lIndex].attribute_value).toString();
        	            }
        	   }
        	   // Add other specified attributes to the item_name 
        	   doc.item_name = add_attribute_to_item_name(doc, "HV (kV)");
        	   doc.item_name = add_attribute_to_item_name(doc, "HV 1 (kV)");
        	   doc.item_name = add_attribute_to_item_name(doc, "HV 2 (kV)");
        	   doc.item_name = add_attribute_to_item_name(doc, "LV (V)");
        	   doc.item_name = add_attribute_to_item_name(doc, "Uk (%)");
        	    //doc.item_name = add_attribute_to_item_name(doc, "P0 (W)");
        	   doc.item_name = add_attribute_to_item_name(doc, "HV LI (kV)");
        	   //replaces all occurrences of "-" with "/" and "." with "," here -g is flag denote global search
        	   doc.item_code =  doc.item_code.replace(/-/g, '/').replace(/\./g, ',');
        	   // incase the HV1 or HV2 is not entered replace  /// to /0/0/
        	   doc.item_code = doc.item_code.replace(/\/\/\//g, '/0/0/');
        	   // replaces all whitespace characters (\s) with '0' 
        	   
        	   //>>ISS-2024-00013
        	   // replaces two or more consecutive slashes with "/0/"
        	   //If the HV Value is not provided, and either the LPA or LWA value is missing
        	   //should display 0 instead of an empty space.
        	   doc.item_code = doc.item_code.replace(/\s/g, '0').replace(/\/{2,}/g, '/0/');
               //<<ISS-2024-00013
        	   break;
        	// >> ISS-2024-00004  
 
            //<< TASK-2024-0580
            //<< TASK-2024-0581
            // Item Name for RGB and NEU group
            case "RGB":
            case "NEU":
                doc.item_name = doc.variant_of;
                // Find the index of the "Power (kVA)" attribute in the attributes array
                let lIndexvalue = doc.attributes.findIndex(element => element.attribute=="Power (kVA)");
                // Check if the "Power (kVA)" attribute exists and has a value
        	    if(lIndexvalue>=0){
        	        //check if attribute value is filled
        	       if(doc.attributes[lIndexvalue].attribute_value) {
        	           // Append the "Power (kVA)" attribute value to the item_name
        	            doc.item_name   = doc.item_name  + ' ' + (doc.attributes[lIndexvalue].attribute_value).toString();
        	        }
        	   }
                // Add other specified attributes to the item_name 
                doc.item_name = add_attribute_to_item_name(doc, "HV (kV)");
                doc.item_name = add_attribute_to_item_name(doc, "HV 1 (kV)");
                doc.item_name = add_attribute_to_item_name(doc, "HV 2 (kV)");
                doc.item_name = add_attribute_to_item_name(doc, "LV (V)");
                doc.item_name = add_attribute_to_item_name(doc, "Uk (%)");
                doc.item_name = add_attribute_to_item_name(doc, "Power LV 1 (KV)");
                doc.item_name = add_attribute_to_item_name(doc, "LV 1 (V)");
                doc.item_name = add_attribute_to_item_name(doc, "Uk LV 1 (%)");
                doc.item_name = add_attribute_to_item_name(doc, "Power LV 2 (KV)");
                doc.item_name = add_attribute_to_item_name(doc, "LV 2 (V)");
                doc.item_name = add_attribute_to_item_name(doc, "Uk LV 2 (%)");
                //replaces all occurrences of "-" with "/" and "." with "," here -g is flag denote global search
                doc.item_code =  doc.item_code.replace(/-/g, '/').replace(/\./g, ',');
                // incase the HV1 or HV2 is not entered replace  /// to /0/0/
                doc.item_code = doc.item_code.replace(/\/\/\//g, '/0/0/');
                // replaces all whitespace characters (\s) with '0'
                // replaces two or more consecutive slashes with "/0/"
        	    //If the HV Value is not provided, and either the LPA or LWA value is missing
        	    //should display 0 instead of an empty space.
                doc.item_code = doc.item_code.replace(/\s/g, '0').replace(/\/{2,}/g, '/0/');
                break;
            //>> TASK-2024-0581
            //>> TASK-2024-0580

        	case "Enclosure":
                // Add attributes to the item name
                doc.item_name = add_attribute_to_item_name(doc, "Enclosure IP Rating");
                doc.item_name = add_attribute_to_item_name(doc, "Mounting Type");
                
                // Replace hyphens with slashes in the item code
                doc.item_code = doc.item_code.replace(/-/g, '/');
                
                // Replace hyphens with slashes in the item name
                //doc.item_name = doc.item_code.replace(/-/g, '/');
                //Store the replaced item code to the item name
                doc.item_name = doc.item_code
                // Replace first slash with space in the item name
                doc.item_name = doc.item_name.replace('/', ' ');
            // << ISS-2024-00004     
                break;
    
            default:
        } //Switch
    } //if(frm.is_new()) {

   
};
frappe.ui.form.on('Item', {
	refresh(frm) {
		
	},
})
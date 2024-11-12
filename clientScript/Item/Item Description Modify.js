// Change References
// Formation of Enclosure Item Description:(Issue# : ISS-2024-00004)
// Enable this script not saving the item under other Item group as well as
// regression for Formation of Enclosure Item Description (ISS-2024-00122)
//>> ISS-2024-00004
frappe.ui.form.on('Item', {
    
    validate(frm) {
        
        var lItemDescription = ''; // Declare variables for item description 
        var lIndex; // Declare the index variable
        
        //if there is no description or the description equals to empty editor value or the form is new 
        if (!frm.doc.description || frm.doc.description == '<div class="ql-editor read-mode"><p><br></p></div>' || frm.is_new()) {
            // Check if the item is a variant of another template item
            if (frm.doc.variant_of) {
                // The following are for Enclosures
                // Find the index of 'Power (kVA)' attribute in the attributes array
                lIndex = frm.doc.attributes.findIndex(element => element.attribute == "Power (kVA)");
                // Add power to the Description if there is index
                if (lIndex >= 0) {
                    lItemDescription += '- ' + frm.doc.attributes[lIndex].attribute_value + [' [kVA]'] + ', '; 

                }

                // Find the index of 'Enclosure IP Rating' attribute in the attributes array
                lIndex = frm.doc.attributes.findIndex(element => element.attribute == "Enclosure IP Rating");
                // Add IP rating to the Description if there is index
                if (lIndex >= 0) {
                    lItemDescription += 'Rating ' + frm.doc.attributes[lIndex].attribute_value + ', ';
                }

                // Find the index of 'Mounting Type' attribute in the attributes array
                lIndex = frm.doc.attributes.findIndex(element => element.attribute == "Mounting Type");
                // Add mounting to the Description if there is index
                if (lIndex >= 0) {
                    lItemDescription += frm.doc.attributes[lIndex].attribute_value;
                }

                // Add the Accessories specification header
                if (lItemDescription) {
                    lItemDescription = 'Accessories specification:<br>' + lItemDescription;
                }
            }

            // If no description is built, fill item description as 'Item Group specification:'
            if (!lItemDescription) {
                lItemDescription = '<p>' + frm.doc.item_group + ' specification:' + '</p>';
            }
            
            //set the description
            cur_frm.set_value("description", lItemDescription);
        }
    },
});
// << ISS-2024-00004
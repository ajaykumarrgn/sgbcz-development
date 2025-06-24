frappe.ui.form.on('Design Configuration', {
    transformer_type(frm) {
        if (frm.doc.transformer_type) {
            // Get the Item templates from the Item based on the Transformer Type
            frappe.db.get_list('Item', {
                filters: {
                    item_name: frm.doc.transformer_type,
                    has_variants: 1
                },
                fields: ['name']
            }).then(laItems => {
                if (laItems && laItems.length > 0) {
                    const lItemName = laItems[0].name;

                    frappe.model.with_doc('Item', lItemName, function() {
                        const ldItemDoc = frappe.model.get_doc('Item', lItemName);
                        
                        // Extract attribute names (i.e.,parameters) from the item based on the trafo type
                        if (ldItemDoc && ldItemDoc.attributes) {
                            const laAttributes = ldItemDoc.attributes.map(ldAttr => ldAttr.attribute);
                            console.log("Attributes for transformer_type item:", laAttributes);

                            frm.clear_table('attributes');

                            // Fetch the min and max ranges of the each attribute 
                            // get from the Item attribute list based on the trafo type
                            frappe.db.get_list('Item Attribute', {
                                filters: {
                                    attribute_name: ["in", laAttributes]
                                },
                                fields: ['attribute_name', 'from_range', 'to_range']
                            }).then(laItemAttributes => {
                                //Mapping the attribute names into the paramater field 
                                laAttributes.forEach(ldAttribute => {
                                    let ldChildRow = frm.add_child('attributes');
                                    ldChildRow.parameter = ldAttribute;

                                    // Find matching attribute in item_attributes list
                                    const ldMatchingAttr = laItemAttributes.find(ldAttr => ldAttr.attribute_name === ldAttribute);
                                    
                                    // For each attribute name, create a child row, assign the attribute to the parameter field,
                                    // and populate the min and max range values from the matching item attribute if found

                                    if (ldMatchingAttr) {
                                        ldChildRow.min = ldMatchingAttr.from_range;
                                        ldChildRow.max = ldMatchingAttr.to_range;
                                    }
                                });

                                frm.refresh_field('attributes');
                            });
                        }
                    });
                } else {
                    // clear child table if no item found
                    frm.clear_table('attributes');
                    frm.refresh_field('attributes');
                }
            });
        } else {
            // clear child table if transformer_type cleared
            frm.clear_table('attributes');
            frm.refresh_field('attributes');
        }
    }
});
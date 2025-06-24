frappe.ui.form.on('Design Configuration', {
    transformer_type(frm) {
        if (frm.doc.transformer_type) {
            frappe.db.get_list('Item', {
                filters: {
                    item_name: frm.doc.transformer_type,
                    has_variants: 1
                },
                fields: ['name']
            }).then(items => {
                if (items && items.length > 0) {
                    const item_name = items[0].name;

                    frappe.model.with_doc('Item', item_name, function() {
                        const itemDoc = frappe.model.get_doc('Item', item_name);

                        if (itemDoc && itemDoc.attributes) {
                            const attributes = itemDoc.attributes.map(attr => attr.attribute);
                            console.log("Attributes for transformer_type item:", attributes);

                            frm.clear_table('attributes');

                            // Fetch all related Item Attributes once for performance
                            frappe.db.get_list('Item Attribute', {
                                filters: {
                                    attribute_name: ["in", attributes]
                                },
                                fields: ['attribute_name', 'from_range', 'to_range']
                            }).then(item_attributes => {
                                attributes.forEach(attribute => {
                                    let child_row = frm.add_child('attributes');
                                    child_row.parameter = attribute;

                                    // Find matching attribute in item_attributes list
                                    const matching_attr = item_attributes.find(attr => attr.attribute_name === attribute);

                                    if (matching_attr) {
                                        child_row.min = matching_attr.from_range;
                                        child_row.max = matching_attr.to_range;
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

frappe.ui.form.on('Factory', {
    refresh(frm) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Item",
                filters: {
                    has_variants: 1
                },
                fields: ["name"]
            },
            callback: function(response) {
                if (response.message) {
                    const itemNames = response.message.map(item => item.name);

                    // Set dynamic filter for item_template field
                    frm.fields_dict.item_template.get_query = function(doc, cdt, cdn) {
                        return {
                            filters: {
                                name: ["in", itemNames]
                            }
                        };
                    };
                }
            }
        });
    }
});

frappe.ui.form.on('Design Configuration', {
    onload(frm) {

        if (frm.doc.factory) {
            fnfetchItemTemplateFromFactory(frm);
        }
        new MutationObserver(() => {
            $("ul[role='listbox']").each(function () {
            if (
                $(this).prev(
                "input[data-doctype='Design Configuration'][data-fieldname='transformer_type']"
                ).length) {
                    $(this).find("div[role='option']:has(i.fa-plus)").hide();
                }
            });
        }).observe(document.body, { childList: true, subtree: true });
    },
    
    factory: function(frm) {
        fnfetchItemTemplateFromFactory(frm);
    },

    is_default: function(frm) {
        fnCheckUniqueDesignAndDefault(frm, 'is_default', __('A default Design Configuration already exists for this Factory: '));
    },

    is_design: function(frm) {
        fnCheckUniqueDesignAndDefault(frm, 'is_design', __('A Design Configuration marked as "is_design" already exists for this Transformer Type: '));
    },
    refresh(frm) {
        if (!frm.is_new()) {
            // Make fields read-only after save
            frm.set_df_property('factory', 'read_only', 1);
            frm.set_df_property('transformer_type', 'read_only', 1);
            frm.set_df_property('is_design', 'read_only', 1);
        } else {
            // Allow editing while creating new document
            frm.set_df_property('factory', 'read_only', 0);
            frm.set_df_property('transformer_type', 'read_only', 0);
            frm.set_df_property('is_design', 'read_only', 0);
        }
    }
});

/**
 * Checks if a given design configuration field is unique and default within a factory.
 * 
 * In each factory:- Only one design can be marked as default.
 * Each design can be enabled for only one transformer type.
 * 
 * This function verifies that the specified field (e.g., a default flag or design enabled flag)
 * is unique across the 'Design Configuration' documents for the same factory.
 * If another document already has this field set, it shows a message and resets the field.
 */
function fnCheckUniqueDesignAndDefault(frm, fieldName, iMessagePrefix) {
    if (!frm.doc[fieldName] || !frm.doc.factory) return;

    let ldFilters = {
        factory: frm.doc.factory
    };
    ldFilters[fieldName] = 1;

    if (fieldName === 'is_design') {
        // Must also check transformer_type for is_design
        if (!frm.doc.transformer_type) return;
        ldFilters['transformer_type'] = frm.doc.transformer_type;
    }

    frappe.db.get_list('Design Configuration', {
        filters: ldFilters,
        fields: ['name'],
        limit: 1
    }).then(ldResponse => {
        if (ldResponse.length && ldResponse[0].name !== frm.doc.name) {
            frappe.msgprint(iMessagePrefix + ldResponse[0].name);
            frm.set_value(fieldName, 0);
        }
    });
}

// Fetches the item templates associated with the selected factory 
// and updates the transformer type options accordingly.
function fnfetchItemTemplateFromFactory(frm) {
    if (!frm.doc.factory) return;

    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "Factory",
            name: frm.doc.factory
        },
        callback: function(ldResponse) {
            if (ldResponse.message) {
                const ldItemTemplateRows = ldResponse.message.item_template || [];
                const laItemTemplateArray = ldItemTemplateRows.map(ldRow => ldRow.item_template);
                fnsetTransformerTypeOptions(frm, laItemTemplateArray);
                frm.refresh_field('transformer_type');
            }
        }
    });
}

// Sets a filter on the transformer_type field to only 
// show options matching the provided list of item templates.
function fnsetTransformerTypeOptions(frm, laitems) {
    frm.fields_dict.transformer_type.get_query = function(doc, cdt, cdn) {
        return {
            filters: [
                ['Item', 'name', 'in', laitems],
                ['Item', 'has_variants', '=', 1]
            ]
        };
    };
}


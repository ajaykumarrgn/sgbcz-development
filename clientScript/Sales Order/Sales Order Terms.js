frappe.ui.form.on('Sales Order', {
    refresh : function(frm) {
       // Set terms and conditions when the form is new
       if (frm.is_new()) {
            frm.events.fnSetTermsandConditions(frm);
        }
    },
    
    fnSetTermsandConditions(frm) {
        let language = frm.doc.language;

        // Set terms and conditions name based on factory and language
        if (frm.doc.custom_factory === "SGB RGB") {
            frm.doc.tc_name = `RGB Order Ack_${language}`; // eslint-disable-line
        } else {
            frm.doc.tc_name = `Order Ack_${language}`; // eslint-disable-line
        }

        // Fetch and set the terms and conditions
        frappe.db.get_value("Terms and Conditions", {"name":frm.doc.tc_name}, "terms", function(tc){
            if (tc){
                frm.doc.terms = tc.terms;
            }
        });

        // Refresh the form fields
        frm.refresh_fields();
    },
    
    // Update terms and conditions on customer change
    customer_name(frm) { // eslint-disable-line
        frm.events.fnSetTermsandConditions(frm);
    },
    
    // Update terms and conditions on factory change
    custom_factory(frm) { // eslint-disable-line
        frm.events.fnSetTermsandConditions(frm);
    },
});

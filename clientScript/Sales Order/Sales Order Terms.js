frappe.ui.form.on('Sales Order', {
    // Event triggered when the form is refreshed
    refresh: function(frm) {
        // If the form is new, set the terms and conditions
        if (frm.is_new()) {
            frm.events.fnSetTermsandConditions(frm);
        }
    },
 
    // Function to determine and set the terms and conditions 
    // based on language and factory
    fnSetTermsandConditions(frm) {
        let lLanguage = frm.doc.language;  // Get the selected language
        let lTcName;  // Variable to hold the terms and conditions name
 
        // Determine the terms and conditions name based on the factory
        if (frm.doc.custom_factory === "SGB RGB") {
            lTcName = `RGB Order Terms_${lLanguage}`;
        } else {
            lTcName = `Order Terms_${lLanguage}`;
        }
 
        // Set the tc_name field
        if (frm.doc.customer){
            frm.set_value('tc_name', lTcName);
            frm.refresh_fields(); 
        }
    },
 
    // Event triggered when the customer field is changed
    customer_name(frm) { //eslint-disable-line
        // Update the terms and conditions based on the new customer value
        frm.events.fnSetTermsandConditions(frm);
    },
 
    // Event triggered when the custom_factory field is changed
    custom_factory(frm) { //eslint-disable-line
        // Update the terms and conditions based on the new factory value
        frm.events.fnSetTermsandConditions(frm);
    },
});
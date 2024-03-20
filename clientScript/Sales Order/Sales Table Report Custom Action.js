frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
        // Add the "Report" button in BOM
        frm.add_custom_button(__("Report"), function() {
            // When this button is clicked,
            var subject = frm.doc.subject;
            var event_type = frm.doc.event_type;

            // Get the user session defaults using frappe.db.get_value
            frappe.db.get_value('User Session Defaults', frappe.session.user, ['from_date', 'to_date'], function(response) {
                if (response) {
                    // response contains the user session defaults
                    var from_date = response.from_date;
                    var to_date = response.to_date;

                    // Call the BOM Analysis Report with filters
                    frappe.set_route('query-report', 'Sales Table', {
                        "sales_order": frm.doc.name,
                        "from_date": from_date,
                        "to_date": to_date
                    });
                }
            });
        });
    }
});

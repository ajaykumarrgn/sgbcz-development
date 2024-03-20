//this is from vs code "Testing"

frappe.query_reports['EBITDA Compute Cost'] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("PO Date From"),
            "fieldtype": "Date",
            "width": "80",
            "default": frappe.datetime.month_start()
        },
        {
            "fieldname": "to_date",
            "label": __("PO Date To"),
            "fieldtype": "Date",
            "width": "80",
            "default": frappe.datetime.month_end()
        }
    ]
}
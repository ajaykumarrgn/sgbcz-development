// Change Request : TASK-2024-00157

// Set the filters to display the information based on the date
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
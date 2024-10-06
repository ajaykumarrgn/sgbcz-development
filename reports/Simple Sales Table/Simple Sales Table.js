
frappe.query_reports['Simple Sales Table'] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("PO Date From"),
            "fieldtype": "Date",
            "width": "80"
        },
        {
            "fieldname": "to_date",
            "label": __("PO Date To"),
            "fieldtype": "Date",
            "width": "80"
        },
        {
            "fieldname": "date_type",
            "label": __("Date Type"),
            "fieldtype": "Select",
            "options": [
                "",
                {
                    "label": __("PO Date"),
                    "value": "PO Date"
                },
                {
                    "label": __("OA Confirmed Date"),
                    "value": "OA Confirmed Date"
                },
                {
                    "label": __("Delivery Date"),
                    "value": "Delivery Date"
                },
                {
                    "label": __("Planned Production End Date"),
                    "value": "Planned Production End Date"
                },
                {
                    "label": __("Invoice Date"),
                    "value": "Invoice Date"
                }
            ],
            "default": ""
        },
        {
            "fieldname": "months",
            "label": __("Months"),
            "fieldtype": "MultiSelectList",
            "options": "Months",
            "get_data": function(iTxt) {
                var laMonths = [
                    {'description': '', 'value': 'Jan'},
                    {'description': '', 'value': 'Feb'},
                    {'description': '', 'value': 'Mar'},
                    {'description': '', 'value': 'Apr'},
                    {'description': '', 'value': 'May'},
                    {'description': '', 'value': 'Jun'},
                    {'description': '', 'value': 'Jul'},
                    {'description': '', 'value': 'Aug'},
                    {'description': '', 'value': 'Sep'},
                    {'description': '', 'value': 'Oct'},
                    {'description': '', 'value': 'Nov'},
                    {'description': '', 'value': 'Dec'}
                ];
                return laMonths;
            }
        },
    ],
    get_datatable_options: function(options) {
        return Object.assign(options, {
            checkboxColumn: true
        });
    },
    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        // Wrap an empty div. Otherwise Total text will display as undefined
		value = $(`<div>${value}</div>`);
		// Make the entire total row bold
		var $value = $(value).css("font-weight", "normal"); 
		// Set the background colour of empty RDG Number on 18 Jul
		if (data && column.fieldname === "rdg_number" && (!data.rdg_number || data.rdg_number === "no")) {
            $value.addClass('bg-danger text-black w-100 h-100');
        }
        // Set the background colour of empty Serial Number on 18 Jul
        if (data && column.fieldname === "serial_number" && (!data.serial_number || data.serial_number === "Not available")) {
            $value.addClass('bg-danger text-black w-100 h-100');
        }
        // Set the background colour of Transformer Status on 18 Jul
		if (data && column.fieldname === "transformer_status") {
            if (data.transformer_status === "Done - Expedited") {
                $value.addClass('bg-success text-black w-100 h-100');
            } else if (data.transformer_status === "Done - OL Stock") {
                $value.addClass('bg-warning text-black w-100 h-100');
            }
        }
 
		// Wrap the component with empty paragraph. Otherwise the changes will not reflect
		value = $value.wrap("<p></p>").parent().html();
		
        return value;
    },

    "onload": function (report) {

        // Fetch from and to date from User Session Defaults Document
        //during onload event using a synchronous call.
        frappe.call({
            "method":"frappe.client.get",
                     "args":{
                        "doctype":"User Session Defaults",
                        "name":frappe.session.user
                    },
                    "async": false,
            "callback": (iResponse)=> {
                if(iResponse.message){
                        // Set the from date fetched from user session to the report filter
                        report.set_filter_value("from_date", iResponse.message?.from_date ? iResponse.message.from_date : frappe.datetime.month_start());
                        // Set the to date fetched from user session to the report filter
                        report.set_filter_value("to_date", iResponse.message?.to_date ? iResponse.message.to_date : frappe.datetime.month_end());
                            }
                    }
        });
    }
    
        
};


//Highlight the selected checkbox row in the Sales Order by shading it dark.
//Fix the first two columns in the Sales table report to facilitate
//easy identification of the remaining data.
//Column filters do not work when no filter data is found in the list.
// Then set the width for the scroll bar.

const style = document.createElement('style');
style.innerHTML = `
    .dt-row--highlight .dt-cell {
        background-color: #fffce7;
        background-color: var(--dt-selection-highlight-color);
        background-color: #DDDDDD;
    }
    .datatable .dt-row {
        height: 50px; /* Adjust the desired row height */
        #display: flex;
        
    }
    .datatable .dt-cell__content {
        white-space: nowrap;
        overflow: visible;
    
    }
    .dt-instance-1 .dt-cell--col-0 {
        display: flex;
        text-align: right;
        position: sticky;
        z-index: 2;
        left: 0px; /* Adjust this value to match the width of col-1 */
    }

    .dt-instance-1 .dt-cell--col-1 {
        display: flex;
        text-align: right;
        position: sticky;
        z-index: 2;
        left: 30px; /* Adjust this value to match the width of col-1 */
    }
    .dt-scrollable__no-data {
        position: absolute !important;
        width: 6829px !important;
    }
    

`;
document.head.appendChild(style); 


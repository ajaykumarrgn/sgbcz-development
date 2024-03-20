// Change References
// Saved Column:(Issue# : ISS-2024-00005)
// Remove the columns filter when there is no data for the filter (Issue# : ISS-2024-00008)
// Some Columns not visible using Saved Column (Issue# : ISS-2024-00020)

frappe.query_reports['ST Temp'] = {
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
        },
        {
            "fieldname": "date_type",
            "label": __("Date Type"),
            "fieldtype": "Select",
            "options": [
                "",
                {
                    "label": __("PO Date"),
                    "value": "PO Date",
                },
                {
                    "label": __("OA Confirmed Date"),
                    "value": "OA Confirmed Date",
                },
                {
                    "label": __("Delivery Date"),
                    "value": "Delivery Date",
                },
                {
                    "label": __("Planned Production End Date"),
                    "value": "Planned Production End Date",
                },
                {
                    "label": __("Invoice Date"),
                    "value": "Invoice Date",
                },
            ],
            "default": ""
        },
        {
            "fieldname": "months",
            "label": __("Months"),
            "fieldtype": "MultiSelectList",
            "options": "Months",
            "get_data": function(txt) {
                var months = [
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
                    {'description': '', 'value': 'Dec'},
                ];
                return months;
            }
        },
        {
            "fieldname": "include_all_fields",
            "label": __("Include All Fields"),
            "fieldtype": "Check",
            "default": true
        },
        {
            "fieldname": "open",
            "label": __("Open"),
            "fieldtype": "Check",
            "default": true
        }
        
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
		
        return value
    },
    // >> ISS-2024-00005
    //Uncomment this section lines of code
    "onload": function (report) {
        // Add inner button to the report page
        report.page.add_inner_button(__("Save Columns"), function() {
            // Get the values of the report
            var lFilters = report.get_values();
            var ltTextArray=[];
            // >> ISS-2024-00020
            // Iterate through header columns (assuming a maximum of 69 columns)
            for (let i = 0; i <= 69; i++) {
            // <<ISS-2024-00020
                // Find the header element in the report
                const CLASSNAME = `dt-cell__content--header-${i}`;
                const ELEMENT = document.querySelector(`.${CLASSNAME}`);
                if (ELEMENT) {
                    // Get the text content of all the header elements and store it in TextArray.
                    const TEXT = ELEMENT.innerText;
                    ltTextArray.push(TEXT);
                   }
                }
                // Whenever empty spaces appear in the header element, use the <br> tag to prevent text skipping
                var ltColumnArray = ltTextArray.map(function(ELEMENT) {
                    return ELEMENT.replace(/\n/g, '<br>');
                });
                // Convert the array values into a JSON string to store them as a single value in the database
                const COLUMN_ORDER_ARRAY=JSON.stringify(ltColumnArray);
                //Set the modified columns as the report columns for the specific user
                frappe.call({
                    "method":"frappe.client.set_value",
                     "args":{
                        "doctype":"User Session Defaults",
                        "name":frappe.session.user,
                        "fieldname":"report_columns",
                        "value":COLUMN_ORDER_ARRAY,
                    },
                // Display a success message when the columns are successfully updated otherwise shows the error mesaage.
                "callback": (r)=> {
                if(r.message){
                        frappe.show_alert({
                                    message:__('Column Preference Saved'),
                                    indicator:'green'
                                }, 5);
                            }
                    },
                "error": (r)=>{
                        if(r.message){
                           frappe.show_alert({
                                    message:__('Failed to Save'),
                                    indicator:'Red'
                                }, 5);
                        }
                    }
                })
            });
    
    }, 
    //<< ISS-2024-00005
        
};


//Highlight the selected checkbox row in the Sales Order by shading it dark.
//Fix the first two columns in the Sales table report to facilitate easy identification of the remaining data.
//Column filters do not work when no filter data is found in the list. Then set the width for the scroll bar.
//>> ISS-2024-00008
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
//>>ISS-2024-00008

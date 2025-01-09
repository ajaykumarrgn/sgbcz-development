// Change References
// Saved Column:(Issue# : ISS-2024-00005)
// Remove the columns filter when there is 
// no data for the filter(Issue# : ISS-2024-00008)
// Some Columns not visible using Saved Column (Issue# : ISS-2024-00020)
// User session defaults functionality is not working (Issue# : ISS-2024-00085)
// filters for trafo type, uncheck open on load 
// and remove month and date filter (US-2024-0141)
// Red mark shown incorrectly 
// when applying column filter in sales table (Problem Ticket: ISS-2024-00062)

frappe.query_reports['Sales Table'] = {
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
        //>>US-2024-0141
        //commented this filter for US-2024-0141
        // {
        //     "fieldname": "date_type",
        //     "label": __("Date Type"),
        //     "fieldtype": "Select",
        //     "options": [
        //         "",
        //         {
        //             "label": __("PO Date"),
        //             "value": "PO Date"
        //         },
        //         {
        //             "label": __("OA Confirmed Date"),
        //             "value": "OA Confirmed Date"
        //         },
        //         {
        //             "label": __("Delivery Date"),
        //             "value": "Delivery Date"
        //         },
        //         {
        //             "label": __("Planned Production End Date"),
        //             "value": "Planned Production End Date"
        //         },
        //         {
        //             "label": __("Invoice Date"),
        //             "value": "Invoice Date"
        //         }
        //     ],
        //     "default": ""
        // },
        // {
        //     "fieldname": "months",
        //     "label": __("Months"),
        //     "fieldtype": "MultiSelectList",
        //     "options": "Months",
        //     "get_data": function(iTxt) {
        //         var laMonths = [
        //             {'description': '', 'value': 'Jan'},
        //             {'description': '', 'value': 'Feb'},
        //             {'description': '', 'value': 'Mar'},
        //             {'description': '', 'value': 'Apr'},
        //             {'description': '', 'value': 'May'},
        //             {'description': '', 'value': 'Jun'},
        //             {'description': '', 'value': 'Jul'},
        //             {'description': '', 'value': 'Aug'},
        //             {'description': '', 'value': 'Sep'},
        //             {'description': '', 'value': 'Oct'},
        //             {'description': '', 'value': 'Nov'},
        //             {'description': '', 'value': 'Dec'}
        //         ];
        //         return laMonths;
        //     }
        // },

        // Include trafo type filter for all factories (US-2024-0141)
        {
            "fieldname": "trafo_type",
            "label": __("Trafo Type"),
            "fieldtype": "MultiSelectList",
            "default": ["SGBCZ"],
            "options": "Trafo Type",
            "get_data": function(iTxt) {
                var laTrafoTypes = [
                    {'description': 'SGBCZ', 'value': 'SGBCZ'},
                    {'description': 'RGB', 'value': 'RGB'},
                    {'description': 'NEU', 'value': 'NEU'}
                ];
                return laTrafoTypes;
            }
        },
        //<<US-2024-0141
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
            "default": false  //<<US-2024-0141 unchecked as default
        }
    ],

    // Display the checkbox as a first column in the report 
    // to allow selection and viewing of the specified sales order details.
    get_datatable_options: function(options) {
        return Object.assign(options, {
            checkboxColumn: true
        });
    },

    // To modify the display of values in a table column 
    // by using the custom formatter function. 
    // It takes the value, row, column, and data as inputs 
    // and applies the styles based on the condition
    // Finally, the function returns the formatted value 
    // wrapped in HTML to ensure the changes are reflected.
    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        // Wrap an empty div. Otherwise Total text will display as undefined
		value = $(`<div>${value}</div>`);
		// Make the entire total row bold
		var $value = $(value).css("font-weight", "normal"); 
		// Set the background colour as red When the RDG Number is empty
		if (data && column.fieldname === "rdg_number" && 
            (!data.rdg_number || data.rdg_number === "no")) {
            $value.addClass('bg-danger text-black w-100 h-100');
        }
        // Set the background colour as red when Serial Number is empty
        if (data && column.fieldname === "serial_number" && 
            (!data.serial_number || data.serial_number === "Not available")) {
            $value.addClass('bg-danger text-black w-100 h-100');
        }
        // Set the background color to green 
        // when the Transformer Status is 'Done-Expedited' 
        // and to yellow when the Transformer Status is 'Done-OL Stock'.
		if (data && column.fieldname === "transformer_status") {
            if (data.transformer_status === "Done - Expedited") {
                $value.addClass('bg-success text-black w-100 h-100');
            } else if (data.transformer_status === "Done - OL Stock") {
                $value.addClass('bg-warning text-black w-100 h-100');
            }
        }

        //>>ISS-2024-00062
        // When applying a column filter with a value 
        // for 'rdg_number' or 'serial_number',
        // the color should only be applied to empty rows, 
        // not to rows with values..
        if (column.fieldname === "rdg_number" || 
            column.fieldname === "serial_number") {
            // If the value is empty or contains only whitespace,
            // apply a red background
            if (!value || !value.text().trim()) {
                $value.addClass("bg-danger text-white");
            } else {
                // Remove colors for non-empty rows in 
                // both rdg number and serial number
                $value.removeClass("bg-danger text-white");
            }
        } //<<ISS-2024-00062
        
		// Wrap the component with empty paragraph.
        // Otherwise the changes will not reflect
		value = $value.wrap("<p></p>").parent().html();
		
        return value;
    },

    // >> ISS-2024-00005
    //Uncomment this section lines of code
    "onload": function (report) {
        
        //>>US-2024-0141
        //default trafo_type filter with ['DTTHZ2N']
        //since direct mention of default not working in multiselector
        let ldStatusFilter = report.get_filter('trafo_type');
    
        if (ldStatusFilter) {
            // Ensure the UI is fully initialized
            setTimeout(() => {
                ldStatusFilter.set_value(['SGBCZ']);
            }, 200);
        }
        //<<US-2024-0141
        // << ISS-2024-00085
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
                    // Set the from date fetched from user session 
                    // to the report filter
                    report.set_filter_value("from_date", iResponse.message?.from_date ? iResponse.message.from_date : frappe.datetime.month_start());
                    // Set the to date fetched from user session 
                    // to the report filter
                    report.set_filter_value("to_date", iResponse.message?.to_date ? iResponse.message.to_date : frappe.datetime.month_end());
                    }
                }
        });
        // >> ISS-2024-00085

        // Add inner button to the report page
        report.page.add_inner_button(__("Save Columns"), function() {
            var laTextArray=[];
            // >> ISS-2024-00020
            // Iterate through header columns (assuming a maximum of 69 columns)
            for (let i = 0; i <= 69; i++) {
            // <<ISS-2024-00020
                // Find the header element in the report
                const CLASSNAME = `dt-cell__content--header-${i}`;
                const ELEMENT = document.querySelector(`.${CLASSNAME}`);
                if (ELEMENT) {
                    // Get the text content of all the header elements 
                    // and store it in TextArray.
                    const TEXT = ELEMENT.innerText;
                    laTextArray.push(TEXT);
                }
            }
            // Whenever empty spaces appear in the header element, 
            // use the <br> tag to prevent text skipping
            var laColumnArray = laTextArray.map(function(ELEMENT) {
                return ELEMENT.replace(/\n/g, '<br>');
            });
            // Convert the array values into a JSON string to store them as
            // a single value in the database
            const COLUMN_ORDER_ARRAY=JSON.stringify(laColumnArray);
            // Set the modified columns as the report columns 
            // for the specific user
            frappe.call({
                "method":"frappe.client.set_value",
                    "args":{
                    "doctype":"User Session Defaults",
                    "name":frappe.session.user,
                    "fieldname":"report_columns",
                    "value":COLUMN_ORDER_ARRAY
                },
            // Display a success message when the columns are successfully 
            // updated otherwise shows the error mesaage.
            "callback": (response)=> {
                if(response.message){
                    frappe.show_alert({
                                message:__('Column Preference Saved'),
                                indicator:'green'
                        }, 5);
                    }
                },
                "error": (response)=>{
                    if(response.message){
                        frappe.show_alert({
                                message:__('Failed to Save'),
                                indicator:'Red'
                            }, 5);
                    }
                }
            });
        });
    }
    //<< ISS-2024-00005
};

//Highlight the selected checkbox row in the Sales Order by shading it dark.
//Fix the first two columns in the Sales table report to facilitate
//easy identification of the remaining data.
//Column filters do not work when no filter data is found in the list.
// Then set the width for the scroll bar.
//>> ISS-2024-00008
const STYLE = document.createElement('style');
STYLE.innerHTML = `
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
document.head.appendChild(STYLE); 
//>>ISS-2024-00008
//Set the filter to enable the checkbox for setting the weekly capacity chart size to 40.(#Issue: ISS-2024-00007)
frappe.query_reports['Weekly Load'] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("End Date From"),
            "fieldtype": "Date",
            "width": "80",
            "default": '2024-01-02'
        },
        {
            "fieldname": "to_date",
            "label": __("End Date To"),
            "fieldtype": "Date",
            "width": "80",
            //"default": frappe.datetime.year_end()
            "default": '2024-12-29'
        },
        //>> ISS-2024-00007)
        {
            "fieldname": "weekly_capacity",
            "label": __("Weekly Capacity"),
            "fieldtype": "Check",
            "default": false
        },
        //<< ISS-2024-00007)
            
    ],
    get_datatable_options: function (options) {
        return Object.assign(options, {
            checkboxColumn: true
            
        });
    },
    formatter: function (value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        
        if (column.fieldname === 'power') {
            column.className = 'dt-instance-1';
        }
        if (data) {
            if (data['power'] !== 'Weekly Capacity') {
                console.log('Logging the data', data, column.fieldname, data['2'])
                if (data['power'] === 'Total') {
                    var report_data = frappe.query_report.data;
                    var weekly_capacity_row = frappe.query_report.data.find(row => row.power === 'Weekly Capacity');

                    value = $(`<div>${value}</div>`);
                    var $value = $(value).css("font-weight", "bold");

                    if (data[column.fieldname] > weekly_capacity_row[column.fieldname]) {
                        $value.addClass("bg-danger text-white");
                    }

                    value = $value.wrap("<p></p>").parent().html();

              //  } else if (column.fieldname === 'col_2' && data['col_2'] > data['weekly_capacity']) {
               } else if (column.fieldname != 'power' && data[column.fieldname] > data['weekly_capacity']) {
                    value = $(`<div>${value}</div>`);
                    var $value = $(value).css("font-weight", "normal");
                    $value.addClass("bg-danger text-white");
                    value = $value.wrap("<p></p>").parent().html();
                }
            }
        }
        return value;
    },

    onload: function (report) {
        
        var firstColumnHeader = $('.dt-container .dt-thead th:first-child');

        // Apply bold font style to the first column header
        firstColumnHeader.css('font-weight', 'bold');
        
    }
    
};
const style = document.createElement('style');

style.innerHTML = `
    .dt-row--highlight .dt-cell {
        background-color: #fffce7;
        background-color: var(--dt-selection-highlight-color);
        background-color: #DDDDDD;
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
    
    
    .dt-instance-1 .dt-cell--col-2 {
        display: flex;
        text-align: right;
        position: sticky;
        z-index: 2;
        left: 60px; /* Adjust this value to match the width of col-1 + col-2 */
    }
    .dt-instance-1 .dt-cell--col-3 {
        display: flex;
        text-align: right;
        position: sticky;
        z-index: 3;
        left: 160px; /* Adjust this value to match the width of col-1 + col-2 */
    }
    svg.frappe-chart.chart {
        height: 320px;
    }
    .graph-svg-tip.comparison {
        text-align: left;
        padding: 0px;
        pointer-events: none;
        top: -130px !important;
        width: 350px !important;
    }
    
    
`;

// Append the <style> element to the <head> of the document
document.head.appendChild(style);
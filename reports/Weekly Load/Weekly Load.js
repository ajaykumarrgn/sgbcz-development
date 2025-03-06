// Set the filter to enable the checkbox for setting
// the weekly capacity chart size to 40.(#Issue: ISS-2024-00007)
// Set the from date and to date based on the current year (ISS-2025-00046)

frappe.query_reports["Weekly Load"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("End Date From"),
      fieldtype: "Date",
      width: "80",
      // "default": '2024-01-02'
      default: fnGetFirstWeekStart(), //<<ISS-2025-00046
    },
    {
      fieldname: "to_date",
      label: __("End Date To"),
      fieldtype: "Date",
      width: "80",
      //"default": '2024-12-29'
      default: fnGetLastDayOfYear(), //<<ISS-2025-00046
    },
    //>> ISS-2024-00007)
    {
      fieldname: "weekly_capacity",
      label: __("Weekly Capacity"),
      fieldtype: "Check",
      default: false,
    },
    //<< ISS-2024-00007)
  ],
  get_datatable_options: function (options) {
    return Object.assign(options, {
      checkboxColumn: true,
    });
  },
  formatter: function (iValue, idRow, idColumn, idData, fnDefaultFormatter) {
    let lValue = fnDefaultFormatter(iValue, idRow, idColumn, idData);

    if (idColumn.fieldname === "power") {
      idColumn.className = "dt-instance-1";
    }
    if (idData) {
      if (idData["power"] !== "Weekly Capacity") {
        if (idData["power"] === "Total") {
          var laReportData = frappe.query_report.data;
          var ldweeklycapacityrow = frappe.query_report.data.find(
            (idRow) => idRow.power === "Weekly Capacity"
          );

          lValue = $(`<div>${lValue}</div>`);
          var $lValue = $(lValue).css("font-weight", "bold");

          if (
            idData[idColumn.fieldname] > ldweeklycapacityrow[idColumn.fieldname]
          ) {
            $lValue.addClass("bg-danger text-white");
          }
          lValue = $lValue.wrap("<p></p>").parent().html();

          //  } else if (idColumn.fieldname === 'col_2' && idData['col_2']
          //  > idData['weekly_capacity']) {
        } else if (
          idColumn.fieldname != "power" &&
          idData[idColumn.fieldname] > idData["weekly_capacity"]
        ) {
          lValue = $(`<div>${lValue}</div>`);
          var $lValue = $(lValue).css("font-weight", "normal");
          $lValue.addClass("bg-danger text-white");
          lValue = $lValue.wrap("<p></p>").parent().html();
        }
      }
    }
    return lValue;
  },

  onload: function (report) {
    var lFirstColumnHeader = $(".dt-container .dt-thead th:first-child");
    // Apply bold font style to the first column header
    lFirstColumnHeader.css("font-weight", "bold");
  },
};

//>>ISS-2025-00046
//Set the from date as the first monday of the current year
function fnGetFirstWeekStart() {
  let lFirstWeekStart = moment(frappe.datetime.year_start());
  // find the first Monday in january
  if (lFirstWeekStart.isoWeekday() !== 1) {
    // If it is not monday, Move to the next Monday
    lFirstWeekStart.add(1, "weeks").isoWeekday(1);
  }
  return lFirstWeekStart.format("YYYY-MM-DD");
}
//Set the to date as the last sunday of the current year
function fnGetLastDayOfYear() {
  let lLastDay = moment(frappe.datetime.year_end());
  // If 31st December is not a Sunday,
  // If it is not, move back to the last Sunday
  if (lLastDay.isoWeekday() !== 7) {
    lLastDay.isoWeekday(0);
  }
  //Return the formatted date
  return lLastDay.format("YYYY-MM-DD");
}
//<<ISS-2025-00046

const L_STYLE = document.createElement("style");

L_STYLE.innerHTML = `
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
document.head.appendChild(L_STYLE);

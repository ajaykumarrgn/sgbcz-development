# Transformer with status Purchsing or Purchasing/Stock only :(Issue : ISS-2024-00033)
# The chart's total weekly capacity doesn't consider the deduction from parallel coils :(Issue : ISS-2024-00035)
# Set the filter to enable the checkbox for setting the weekly capacity chart size to 40. (Issue : ISS-2024-00007)
# Throw error message if years are different in the from and to date filters(Issue : ISS-2024-00054)
# Show only the Submitted documents in the weekly load report (Issue : ISS-2024-00120)

def fn_get_columns(id_filters):
    # To Get the Calendar Week from a given Date
    def fn_get_calander_week(i_date):
        # Convert the Date String into a Date object in any format
        l_date = frappe.utils.getdate(i_date)
        # Return the Calendar Week as a String
        return str(l_date.isocalendar()[1])

    # commented the section of code because it would execute before displaying the error message.>>ISS-2024-00054
    #  def get_calander_year(i_date):
    #     date = frappe.utils.getdate(i_date)
    #     return (str(date.isocalendar()[0]))
    # from_date = filters.get('from_date')
    # to_date = filters.get('to_date')
    # if (int(get_calander_year(from_date)) != int(get_calander_year(to_date)) ):
    #     frappe.throw('Please use the Same Year')
    # <<ISS-2024-00054

    la_columns = [
        {"fieldname": "power", "label": _("power"), "fieldtype": "Data", "width": 100},
        {
            "fieldname": "weekly_capacity",
            "label": _("Weekly Capacity"),
            "fieldtype": "Int",
            "width": 50,
        },
    ]

    la_columnswk = []
    # Get the Calendar Week based on the "from_date" and "to_date" filters.
    l_from_week = fn_get_calander_week(id_filters["from_date"])
    
    l_to_week = fn_get_calander_week(id_filters["to_date"])
    
    # Loop through calendar weeks between the "from_date" and "to_date".
    for l_week in range(int(l_from_week), int(l_to_week)):
        ld_column = dict(
            {"fieldname": str(l_week), "label": (str(l_week)), "fieldtype": "Int", "width": 50}
        )
        la_columnswk.append(ld_column)
    la_columns.extend(la_columnswk)
    # Add the last column for Rating Weekly capacity
    # column = dict({"fieldname": "weekly_capacity", "label" : _("Weekly Capacity"), "fieldtype": "Int", "width": 50 })
    # Append the Column to the list of Week Columns
    la_columns.append(ld_column)
    return la_columns


#
# Main function to process the data for the final report
#
def fn_get_final_data(id_filters):

    #  Begin of sub functions
    # >>ISS-2024-00054
    # Get the from date and to date for the year
    def fn_get_calander_year(i_date):
        l_date = frappe.utils.getdate(i_date)
        # Returns the week number of the year by using the ISO calendar and especially returns the [0] only for the year
        return str(l_date.isocalendar()[0])

    l_from_date = id_filters["from_date"]
    l_to_date = id_filters["to_date"]
    # Check if the calendar years of 'from_date' and 'to_date' are different
    if int(fn_get_calander_year(l_from_date)) != int(fn_get_calander_year(l_to_date)):
        # If the years are different, raise an exception with a message
        frappe.throw(_("Please use the Same Year in the Date Range"))
    # <<ISS-2024-00054

    #   Get unique list in a given array for the specified key

    def fn_get_unique(ia_table, i_key):
        la_unique = list(set([d[i_key] for d in ia_table]))
        return la_unique

    def fn_get_calander_week(i_date):
        l_date = frappe.utils.getdate(i_date)
        return str(l_date.isocalendar()[1])

    def fn_get_planning_row_dict(i_from_date, i_to_date):
        l_from_week = fn_get_calander_week(i_from_date)
        l_to_week = fn_get_calander_week(i_to_date)
        # add 1 week more for the planning row as sometimes the calander week for the to date will be a week less
        ld_planning_row = {
            str(week): 0 for week in range(int(l_from_week), (int(l_to_week) + 1))
        }
        ld_planning_row["power"] = ""
        ld_planning_row["weekly_capacity"] = 0
        return dict(ld_planning_row)

    #   Get All schedule lines with planned production end date between the filter date
    #   Field 'parent' is Delivery Note corresponding to a schedule line
    #   Ignore cancelled documents(docstatus != 2)
    def fn_get_schedule_lines(id_filters):
        # frappe.get_all isn't working with between filter for this case hence using frappe.db.sql
        ld_schedule_lines = frappe.db.sql(
            """select pos, planned_production_end_date, parent
                            from `tabDelivery Schedule`
                            where planned_production_end_date BETWEEN %(from_date)s AND %(to_date)s
                            # >> ISS-2024-00033
                            # Filter the data based on the status being 'Purchasing' or 'Purchasing/Stock'.
                            and status IN ('Purchasing', 'Purchasing/Stock')
                            """,
            # << ISS-2024-00033
            {"to_date": id_filters.to_date, "from_date": id_filters.from_date},
            as_dict=1,
        )
        return ld_schedule_lines

    #
    #   Get delivery Note items for the schedule lines
    #   @params it_delivery_notes - array of delivery notes
    #   @params it_unique_pos - array unique pos(eg [10,20,30])
    def fn_get_delivery_items(ia_delivery_notes, ia_unique_pos):
        # define the filters
        # Delivery Note Items whose parents are in list of Delivery Notes schedule lines
        # and only the Transformer Item positions ie(10, 20, 30 ...)
        ld_filters = {
            "parent": ("IN", ia_delivery_notes),
            "pos": ("IN", ia_unique_pos),
            # In "docstatus != 2," it displays both draft and submitted records.
            #'docstatus': ("!=", 2), #<< Commented this line for the show only the submitted documents (ISS-2024-00120)
            'docstatus': ("=", 1),  # <<ISS-2024-00120
        }
        # Get delivery items from the 'Delivery Note Item' doctype
        # with specified fields and filters
        ld_et_delivery_items = frappe.get_all(
            "Delivery Note Item",
            fields=("parent", "pos", "item_code"),
            filters=ld_filters,
        )
        # Sort the 'et_delivery_items' list based on 'parent' and 'pos' fields in ascending order
        ld_et_delivery_items = sorted(
            ld_et_delivery_items, key=lambda x: (x["parent"], x["pos"])
        )
        # Return the sorted 'et_delivery_items' list
        return ld_et_delivery_items

    # Get the transformer ratings for a list of unique items

    def fn_get_transformer_rating(ia_unique_items):
        # Get 'Item Variant Attribute' records with specified fields and filters
        # where 'parent' field is in the list 'it_unique_items'
        # and 'attribute' is 'POWER (kVA)'
        ld_et_items_rating = frappe.get_all(
            "Item Variant Attribute",
            fields=("parent", "attribute", "attribute_value"),
            filters={
                "parent": ("IN", ia_unique_items),
                "attribute": "POWER (kVA)",
            },
        )
        # Return the retrieved transformer ratings
        return ld_et_items_rating

    #  Get the list of transformers with parallel coil
    def fn_get_transformer_parallel_list(ia_unique_items):
        # Get 'Item Variant Attribute' records with specified fields and filters
        # where 'parent' field is in the list 'it_unique_items',
        # 'attribute' is 'Parallel coil', and 'attribute_value' is 'YES'
        ld_et_parallel_list = frappe.get_all(
            "Item Variant Attribute",
            fields=("parent", "attribute", "attribute_value"),
            filters={
                "parent": ("IN", ia_unique_items),
                "attribute": "Parallel coil",
                "attribute_value": "YES",
            },
        )
        return ld_et_parallel_list

    # Add Paralle information to the rating for tranformers with attribute Parallel coil
    def fn_add_parallel_to_rating(ia_transformers_rating, ia_unique_parallel):

        for ld_item in (
            ld_item
            for ld_item in ia_transformers_rating
            if (ld_item["parent"] in ia_unique_parallel)
        ):
            ld_item["attribute_value"] = ld_item["attribute_value"] + "P"
        return ia_transformers_rating

    # Add planned overall weekly capacity as a row to the output table
    def fn_get_weekly_planned_capacity_row(
        id_planned_capacity, id_planning_row, id_parallel_row
    ):
        id_planning_row["power"] = "Weekly Capacity"
        # id_planning_row[week] for week in id_planned_capacity
        for ld_weekly_capacity in id_planned_capacity["planned_capacity_item"]:

            # Get the week number from the planned weekly capacity in string format
            l_week_number = str(ld_weekly_capacity["week"])

            # Initialize the number of transformers to be reduced
            # transformers_to_be_reduced  = 0

            ## For every 3 parallel coils per week reduce the planned capacity by 1
            # transformers_to_be_reduced = (int(id_parallel_row[l_week_number])-1) // int(id_planned_capacity.parallel_weekly_capacity)

            # Get the planned weekly capacity and reduce it by the parallel factor from above step
            # id_planning_row[week_number] = int(ld_weekly_capacity['qty']) - transformers_to_be_reduced

            l_transformers_to_be_reduced = 0

            # Check if parallel coils are present and greater than 0
            if id_parallel_row.get(l_week_number, 0) > 0:
                # Calculate the number of transformers to be reduced for every 3 parallel coils per week
                l_transformers_to_be_reduced = (
                    int(id_parallel_row[l_week_number]) - 1
                ) // int(id_planned_capacity.parallel_weekly_capacity)

                # Get the planned weekly capacity and reduce it by the parallel factor from above step
            id_planning_row[l_week_number] = max(
                0, int(ld_weekly_capacity["qty"]) - l_transformers_to_be_reduced
            )

        id_planning_row["ld_weekly_capacity"] = 29
        return id_planning_row

    # Calculate sum of parallel coils per week
    def fn_get_sum_of_parallel(id_planning_row, i_plwk, id_parallel_row):
        if "P" in id_planning_row["power"]:
            id_parallel_row[i_plwk] = id_parallel_row[i_plwk] + 1

        return id_parallel_row

    # Calculate sum of individual ratings per week
    def fn_get_total(id_planning_row, i_plwk, id_total_row):
        id_total_row[i_plwk] = id_total_row[i_plwk] + 1
        return id_total_row

    def fn_get_final_data_records(
        id_filters,
        ia_unique_rating,
        ia_transformers_rating,
        ia_delivery_note_items,
        ia_schedule_lines,
        id_planned_capacity,
    ):
        # Define a custom key function to extract numeric portion from a string
        def fn_custom_sort_key(i_string):
            # Remove non-numeric characters from the end of the string
            i_string = "".join(c for c in i_string if c.isdigit() or c == "-")

            # Convert the string to an integer, treating '-' as a negative sign
            return int(i_string) if i_string.isdigit() else -int(i_string[1:]) if i_string[1:].isdigit() else 0

        # Initialize an empty output array
        la_e_final_data = []
        # Get the dict for output table.
        ld_planning_row_dict = fn_get_planning_row_dict(
            id_filters.from_date, id_filters.to_date
        )

        # Create dict for parallel row
        ld_parallel_row = dict(ld_planning_row_dict)
        ld_parallel_row["power"] = "Parallel"
        ld_parallel_row["weekly_capacity"] = (
            id_planned_capacity.parallel_weekly_capacity
        )

        # Create a total Row
        ld_total_row = dict(ld_planning_row_dict)
        ld_total_row["power"] = "Total"
        ld_total_row["weekly_capacity"] = 30

        ia_unique_rating = sorted(ia_unique_rating, key=fn_custom_sort_key)
        for i_rating in ia_unique_rating:
            # Initialize planning row with empty values
            ld_planning_row = dict(ld_planning_row_dict)
            # assign the rating for planning row
            ld_planning_row["power"] = i_rating
            for ld_item in (
                ld_item
                for ld_item in ia_transformers_rating
                if ld_item["attribute_value"] == i_rating
            ):
                for i_delivery_item in (
                    i_delivery_item
                    for i_delivery_item in ia_delivery_note_items
                    if i_delivery_item["item_code"] == ld_item["parent"]
                ):
                    for ld_schedule_line in ia_schedule_lines:
                        if (
                            ld_schedule_line["parent"] == i_delivery_item["parent"]
                        ) and ld_schedule_line["pos"] == i_delivery_item["pos"]:
                            l_pl_wk = fn_get_calander_week(
                                ld_schedule_line["planned_production_end_date"]
                            )
                           
                            ld_planning_row[l_pl_wk] = ld_planning_row[l_pl_wk] + 1

                            ld_parallel_row = fn_get_sum_of_parallel(
                                ld_planning_row, l_pl_wk, ld_parallel_row
                            )
                            ld_total_row = fn_get_total(
                                ld_planning_row, l_pl_wk, ld_total_row
                            )

            # Add the weekly capacity for the respective rating
            for ld_rating_capacity in (
                ld_weekly_capacity
                for ld_weekly_capacity in id_planned_capacity["rating_weekly_capacity"]
                if ld_weekly_capacity["rating"] == i_rating
            ):
                ld_planning_row["weekly_capacity"] = ld_rating_capacity[
                    "weekly_capacity"
                ]

            la_e_final_data.append(ld_planning_row)
        # Sort the output based on power
        # e_final_data = sorted(e_final_data, key=lambda x: (x['power']) )

        # Add The weekly capacity row
        la_e_final_data.append(
            fn_get_weekly_planned_capacity_row(
                id_planned_capacity, dict(ld_planning_row_dict), ld_parallel_row
            )
        )

        #  Add sum of parallel per week row
        la_e_final_data.append(ld_parallel_row)

        # Add Total row to the output
        la_e_final_data.append(ld_total_row)

        return la_e_final_data

    # Get Planned Capacity
    def fn_get_planned_capacity(id_filters):
        l_calander_year = frappe.utils.formatdate(
            id_filters.from_date, format_string="YYYY"
        )
        ld_et_planned_capacity = frappe.get_doc(
            "Planned Capacity", l_calander_year
        ).as_dict()
        return ld_et_planned_capacity

    #
    #   End of sub functions

    la_final_data = []
    la_schedule_lines = fn_get_schedule_lines(id_filters)

    # Get unique delivery notes for the schedule lines selected
    la_delivery_notes = fn_get_unique(la_schedule_lines, "parent")

    # Get the unique pos - logic is we will only need pos ranging 10, 20, 30...
    # and not 10.1, 10.2. This is required to filter only parent items in delivery items table
    la_unique_pos = fn_get_unique(la_schedule_lines, "pos")

    # Get Delivery Note Items for the schedule lines
    la_delivery_note_items = fn_get_delivery_items(la_delivery_notes, la_unique_pos)

    # Get unique items from the delivery note items to get the attributes(Rating)
    la_unique_items = fn_get_unique(la_delivery_note_items, "item_code")

    # Get the power rating(Attribute POWER(KVA)) of individual Items(Transformers)
    la_transformers_rating = fn_get_transformer_rating(la_unique_items)

    # Get Parallel coil information(Attribute Parallel coil) of individual Items(Transformers)
    la_transformers_parallel_list = fn_get_transformer_parallel_list(la_unique_items)

    # Get only the list of transformers which has parallel coil
    la_unique_parallel = fn_get_unique(la_transformers_parallel_list, "parent")

    # Sort the rating
    # item_rating = sorted(item_rating, key=lambda x: (x['attribute_value']) )

    la_item_rating = fn_add_parallel_to_rating(
        la_transformers_rating, la_unique_parallel
    )

    # Get Unique rating, this is required to prepare the output table record per rating
    la_unique_rating = fn_get_unique(la_transformers_rating, "attribute_value")

    # Get Planned Capacity for the fiscal year
    la_planned_capacity = fn_get_planned_capacity(id_filters)

    # Final output
    la_final_data = fn_get_final_data_records(
        id_filters,
        la_unique_rating,
        la_transformers_rating,
        la_delivery_note_items,
        la_schedule_lines,
        la_planned_capacity,
    )

    return la_final_data


# Getting data for the chart


def fn_get_chart_data(i_planning_data, id_filters):
    def fn_get_calander_week(i_date):
        l_date = frappe.utils.getdate(i_date)
        return str(l_date.isocalendar()[1])

    def fn_get_planned_capacity(i_date):
        l_calander_year = frappe.utils.formatdate(i_date, format_string="YYYY")
        return frappe.get_all(
            "Planned Capacity Item",
            fields=("week", "qty"),
            filters={"parent": l_calander_year},
            order_by="week",
        )

    # >>ISS-2024-00035
    l_from_week = fn_get_calander_week(id_filters.from_date)
    l_to_week = fn_get_calander_week(id_filters.to_date)
    la_datasets = []
    la_labels = []

    # commented for the issue of not displaying correct planned data (# ISS-2024-00035)
    # planned_dataset = {}
    # planned_dataset['name'] = "Planned"
    # planned_dataset['values'] = list([d['qty'] for d in fn_get_planned_capacity(id_filters.from_date)])
    # planned_dataset['chartType'] = 'line'
    # planned_dataset['type'] = 'line'
    # planned_data = []

    for l_week in range(int(l_from_week), int(l_to_week)):
        la_labels.append(str(l_week))

    for index, data in enumerate(i_planning_data):
        # Ignore Row Weekly Capacity and Parallel for stacked bar chart. It is already used in line chart
        # Stack all the power per week

        if data["power"] not in ["Parallel", "Total"]:
            la_values = []
            ld_dataset = {}

            # get the data of the Row weekly capacity and display in line chart
            if data["power"] == "Weekly Capacity":
                if id_filters.weekly_capacity == 1:
                    ld_dataset["name"] = data["power"]
                    ld_dataset["chartType"] = "line"
                    # <<ISS-2024-00035

                    for l_week in range(int(l_from_week), int(l_to_week)):
                        values.append(data.get(str(l_week)))
                    # >> ISS-2024-00007

                    ld_dataset["values"] = la_values

                    la_datasets.append(ld_dataset)
                    # << ISS-2024-00007
            else:

                ld_dataset["name"] = data["power"]
                ld_dataset["chartType"] = "bar"

                for l_week in range(int(l_from_week), int(l_to_week)):
                    la_values.append(data.get(str(l_week)))

                ld_dataset["values"] = la_values

                la_datasets.append(ld_dataset)

    # datasets.append(planned_dataset)

    ld_chart_data = {
        "data": {
            "labels": la_labels,
            "datasets": la_datasets,
        },
        "yMarkers": [{"label": "", "value": 0, "type": "solid"}],
        "chartOptions": {"height": 40},  # Adjust chart height as needed
        "yMarkers": [
            {"label": "Marker", "value": "80", "options": {"labelPos": "left"}}
        ],
        # "type": "axis-mixed",
        "barOptions": {"stacked": True},
        "colors": [
            "#db2777",
            "#ffa3ef",
            "light-blue",
            "#854d0e",
            "#0891b2",
            "#8b5cf6",
            "#00008B",
            "#C0C0C0",
            "#FF69B4",
            "#2ecc71",
            "#e74c3c",
            "#f39c12",
            "#1abc9c",
            "#9b59b6",
            "#34495e",
            "#16a085",
            "#95a5a6",
            "#2c3e50",
            "#8e44ad",
            "#f5b041",
            "#c0392b",
            "#27ae60",
            "#3498db",
            "#d35400",
        ],
    }

    return ld_chart_data


####
# Report Block
####

final_data = fn_get_final_data(filters)
data = fn_get_columns(filters), final_data, None, fn_get_chart_data(final_data, filters)
# result = [final_data]

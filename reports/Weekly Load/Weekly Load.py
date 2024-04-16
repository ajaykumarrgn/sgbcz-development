#Transformer with status Purchsing or Purchasing/Stock only :(Issue : ISS-2024-00033)
#The chart's total weekly capacity doesn't consider the deduction from parallel coils :(Issue : ISS-2024-00035)
#Set the filter to enable the checkbox for setting the weekly capacity chart size to 40. (Issue : ISS-2024-00007)
#Throw error message if years are different in the from and to date filters(Issue : ISS-2024-00054)

def get_columns(filters):
    # To Get the Calendar Week from a given Date
    def get_calander_week(i_date):
        # Convert the Date String into a Date object in any format
        date = frappe.utils.getdate(i_date)
        # Return the Calendar Week as a String
        return(str(date.isocalendar()[1]))
    
    #commented the section of code because it would execute before displaying the error message.>>ISS-2024-00054
    #  def get_calander_year(i_date):
    #     date = frappe.utils.getdate(i_date)
    #     return (str(date.isocalendar()[0]))
    # from_date = filters.get('from_date')
    # to_date = filters.get('to_date')
    # if (int(get_calander_year(from_date)) != int(get_calander_year(to_date)) ):
    #     frappe.throw('Please use the Same Year')          
    #<<ISS-2024-00054

    columns = [{"fieldname": "power", "label": _("power"), "fieldtype": "Data", "width": 100},
                {"fieldname": "weekly_capacity", "label": _("Weekly Capacity"), "fieldtype": "Int", "width": 50},
                ]
    
    columnswk = []
    # Get the Calendar Week based on the "from_date" and "to_date" filters.
    from_week = get_calander_week(filters['from_date'])
    #frappe.msgprint('From Week' + str(from_week))
    to_week = get_calander_week(filters['to_date'])
    #log(to_week)
    
    # Loop through calendar weeks between the "from_date" and "to_date".
    for wk in range(int(from_week), int(to_week)):
        column = dict({"fieldname": str(wk), "label" : _(str(wk)), "fieldtype": "Int", "width": 50 })
        columnswk.append(column)
    columns.extend(columnswk)
    # Add the last column for Rating Weekly capacity 
    #column = dict({"fieldname": "weekly_capacity", "label" : _("Weekly Capacity"), "fieldtype": "Int", "width": 50 })
    # Append the Column to the list of Week Columns
    columns.append(column)
    return columns
    

#
# Main function to process the data for the final report
#
def get_final_data(filters):

#  Begin of sub functions
    #>>ISS-2024-00054
    # Get the from date and to date for the year
    def fn_get_calander_year(i_date):
        l_date = frappe.utils.getdate(i_date)
        # Returns the week number of the year by using the ISO calendar and especially returns the [0] only for the year
        return (str(l_date.isocalendar()[0]))
    
    l_from_date = filters['from_date']
    l_to_date = filters['to_date']
    # Check if the calendar years of 'from_date' and 'to_date' are different
    if (int(fn_get_calander_year(l_from_date)) != int(fn_get_calander_year(l_to_date))):
        # If the years are different, raise an exception with a message
        frappe.throw('Please use the Same Year in the Date Range')    
    #<<ISS-2024-00054
        
    #   Get unique list in a given array for the specified key 

    def get_unique(table, key):
        unique = list(set([d[key] for d in table]))
        return unique
    
    def get_calander_week(i_date):
        date = frappe.utils.getdate(i_date)
        return(str(date.isocalendar()[1]))
        
    def get_planning_row_dict(i_from_date, i_to_date):
        from_week = get_calander_week(i_from_date)
        to_week = get_calander_week(i_to_date)
        # add 1 week more for the planning row as sometimes the calander week for the to date will be a week less
        planning_row = {str(week): 0 for week in range(int(from_week), (int(to_week)+1))}
        planning_row['power']=''
        planning_row['weekly_capacity']=0
        return dict(planning_row)
        
    #   Get All schedule lines with planned production end date between the filter date
    #   Field 'parent' is Delivery Note corresponding to a schedule line
    #   Ignore cancelled documents(docstatus != 2)
    def get_schedule_lines(filters):
        # frappe.get_all isn't working with between filter for this case hence using frappe.db.sql
        schedule_lines = frappe.db.sql("""select pos, planned_production_end_date, parent
                            from `tabDelivery Schedule`
                            where planned_production_end_date BETWEEN %(from_date)s AND %(to_date)s
                            # >> ISS-2024-00033
                            # Filter the data based on the status being 'Purchasing' or 'Purchasing/Stock'.
                            and status IN ('Purchasing', 'Purchasing/Stock')
                            """,
                            # << ISS-2024-00033
                            {"to_date": filters.to_date, "from_date": filters.from_date},
                            as_dict=1,)
        return schedule_lines
    #
    #   Get delivery Note items for the schedule lines
    #   @params it_delivery_notes - array of delivery notes
    #   @params it_unique_pos - array unique pos(eg [10,20,30])
    def get_delivery_items(it_delivery_notes, it_unique_pos):
        # define the filters
        # Delivery Note Items whose parents are in list of Delivery Notes schedule lines
        # and only the Transformer Item positions ie(10, 20, 30 ...)
        filters={
            'parent': ('IN',it_delivery_notes),
            'pos': ('IN', it_unique_pos),
            'docstatus': ("!=", 2),
        }
        # Get delivery items from the 'Delivery Note Item' doctype
        # with specified fields and filters
        et_delivery_items = frappe.get_all(
            'Delivery Note Item', 
            fields=( 'parent' ,'pos','item_code'),
            filters=filters,
        )
        # Sort the 'et_delivery_items' list based on 'parent' and 'pos' fields in ascending order
        et_delivery_items = sorted(et_delivery_items, key=lambda x: (x['parent'], x['pos']) )
        # Return the sorted 'et_delivery_items' list
        return et_delivery_items
    
    #Get the transformer ratings for a list of unique items
    
    def get_transformer_rating(it_unique_items):
        # Get 'Item Variant Attribute' records with specified fields and filters
        # where 'parent' field is in the list 'it_unique_items'
        # and 'attribute' is 'POWER (kVA)'
        et_items_rating = frappe.get_all(
            'Item Variant Attribute', 
            fields=( 'parent' ,'attribute','attribute_value'),
            filters={
            'parent': ('IN',it_unique_items),
            'attribute': 'POWER (kVA)',
            },
        )
        # Return the retrieved transformer ratings
        return et_items_rating
    #  Get the list of transformers with parallel coil    
    def get_transformer_parallel_list(it_unique_items):
        # Get 'Item Variant Attribute' records with specified fields and filters
        # where 'parent' field is in the list 'it_unique_items',
        # 'attribute' is 'Parallel coil', and 'attribute_value' is 'YES'
        et_parallel_list = frappe.get_all(
            'Item Variant Attribute', 
            fields=( 'parent' ,'attribute','attribute_value'),
            filters={
            'parent': ('IN',it_unique_items),
            'attribute': 'Parallel coil',
            'attribute_value': 'YES',
            },
        )
        return et_parallel_list 
        
    # Add Paralle information to the rating for tranformers with attribute Parallel coil
    def add_parallel_to_rating(it_transformers_rating, it_unique_parallel):
        
        for item in ( item for item in it_transformers_rating if (item['parent'] in it_unique_parallel)):
            item['attribute_value']  = item['attribute_value'] + 'P'
        return it_transformers_rating
        
    # Add planned overall weekly capacity as a row to the output table     
    def get_weekly_planned_capacity_row(i_planned_capacity, i_planning_row, i_parallel_row):
        i_planning_row['power'] = 'Weekly Capacity'
        #i_planning_row[week] for week in i_planned_capacity
        for weekly_capacity in i_planned_capacity['planned_capacity_item']:
            
            # Get the week number from the planned weekly capacity in string format
            week_number = str(weekly_capacity['week'])
            
            # Initialize the number of transformers to be reduced
            #transformers_to_be_reduced  = 0
            
            ## For every 3 parallel coils per week reduce the planned capacity by 1
            #transformers_to_be_reduced = (int(i_parallel_row[week_number])-1) // int(i_planned_capacity.parallel_weekly_capacity)
            
            # Get the planned weekly capacity and reduce it by the parallel factor from above step
            #i_planning_row[week_number] = int(weekly_capacity['qty']) - transformers_to_be_reduced
            
            
            transformers_to_be_reduced = 0
        
            # Check if parallel coils are present and greater than 0
            if i_parallel_row.get(week_number, 0) > 0:
            # Calculate the number of transformers to be reduced for every 3 parallel coils per week
                transformers_to_be_reduced = (int(i_parallel_row[week_number]) - 1) // int(i_planned_capacity.parallel_weekly_capacity)
        
                # Get the planned weekly capacity and reduce it by the parallel factor from above step
            i_planning_row[week_number] = max(0, int(weekly_capacity['qty']) - transformers_to_be_reduced)
            
        i_planning_row['weekly_capacity'] = 29
        return i_planning_row
        
    # Calculate sum of parallel coils per week
    def get_sum_of_parallel(i_planning_row, i_plwk, i_parallel_row):
        if 'P' in i_planning_row['power']:
            i_parallel_row[i_plwk] = i_parallel_row[i_plwk] + 1
            
        return i_parallel_row
        
    # Calculate sum of individual ratings per week
    def get_total(i_planning_row, i_plwk, i_total_row):
        i_total_row[i_plwk] = i_total_row[i_plwk] + 1
        return i_total_row
        
    def get_final_data_records(filters, unique_rating, transformers_rating, delivery_note_items, schedule_lines, i_planned_capacity):
        # Define a custom key function to extract numeric portion from a string
        def custom_sort_key(s):
            # Remove non-numeric characters from the end of the string
            s = ''.join(c for c in s if c.isdigit() or c == '-')
    
            # Convert the string to an integer, treating '-' as a negative sign
            return int(s) if s.isdigit() else -int(s[1:]) if s[1:].isdigit() else 0
            
        #Initialize an empty output array    
        e_final_data = []
        # Get the dict for output table. 
        planning_row_dict = get_planning_row_dict(filters.from_date, filters.to_date)
        
        # Create dict for parallel row
        parallel_row = dict(planning_row_dict)
        parallel_row['power'] = 'Parallel'
        parallel_row['weekly_capacity'] = i_planned_capacity.parallel_weekly_capacity
        
        # Create a total Row
        total_row = dict(planning_row_dict)
        total_row['power'] = 'Total'
        total_row['weekly_capacity'] = 30
        
        unique_rating = sorted(unique_rating, key=custom_sort_key)
        for rating in unique_rating:
            # Initialize planning row with empty values
            planning_row = dict(planning_row_dict)
            # assign the rating for planning row
            planning_row['power'] = rating
            for item in (item for item in transformers_rating if item['attribute_value'] == rating):
                for delivery_item in (delivery_item for delivery_item in delivery_note_items if delivery_item['item_code'] == item['parent']):
                    for schedule_line in schedule_lines:
                        if (schedule_line['parent'] == delivery_item['parent']) and schedule_line['pos'] == delivery_item['pos']:
                            pl_wk = get_calander_week(schedule_line['planned_production_end_date'])
                            #frappe.msgprint("planning week" + schedule_line['parent'] + str(pl_wk))
                            planning_row[pl_wk] = planning_row[pl_wk] + 1
                            
                            parallel_row = get_sum_of_parallel(planning_row, pl_wk, parallel_row)
                            total_row = get_total(planning_row, pl_wk, total_row)
            
            # Add the weekly capacity for the respective rating 
            for rating_capacity in (weekly_capacity for weekly_capacity in i_planned_capacity['rating_weekly_capacity'] if weekly_capacity['rating'] == rating):
                planning_row['weekly_capacity'] = rating_capacity['weekly_capacity']
   
            e_final_data.append(planning_row)
        # Sort the output based on power    
        #e_final_data = sorted(e_final_data, key=lambda x: (x['power']) )
        
        #  Add The weekly capacity row
        e_final_data.append(get_weekly_planned_capacity_row(i_planned_capacity, dict(planning_row_dict), parallel_row) )
        
        #  Add sum of parallel per week row
        e_final_data.append( parallel_row )
        
        #  Add Total row to the output
        e_final_data.append( total_row )
            
        return e_final_data
    # Get Planned Capacity
    def get_planned_capacity(i_filters):
        calander_year = frappe.utils.formatdate(i_filters.from_date, format_string="YYYY")
        et_planned_capacity = frappe.get_doc('Planned Capacity', calander_year).as_dict()
        return et_planned_capacity
    
#  
#   End of sub functions
    
    final_data = []
    schedule_lines = get_schedule_lines(filters)
    
    # Get unique delivery notes for the schedule lines selected
    delivery_notes = get_unique(schedule_lines, 'parent')
    
    # Get the unique pos - logic is we will only need pos ranging 10, 20, 30...
    # and not 10.1, 10.2. This is required to filter only parent items in delivery items table
    unique_pos = get_unique(schedule_lines, 'pos')
    
    # Get Delivery Note Items for the schedule lines
    delivery_note_items = get_delivery_items(delivery_notes, unique_pos)
    
    # Get unique items from the delivery note items to get the attributes(Rating)
    unique_items = get_unique(delivery_note_items, 'item_code')
    
    # Get the power rating(Attribute POWER(KVA)) of individual Items(Transformers)
    transformers_rating = get_transformer_rating(unique_items)
    
    # Get Parallel coil information(Attribute Parallel coil) of individual Items(Transformers)
    transformers_parallel_list = get_transformer_parallel_list(unique_items)
    
    # Get only the list of transformers which has parallel coil
    unique_parallel = get_unique(transformers_parallel_list, 'parent')
    
    # Sort the rating
    # item_rating = sorted(item_rating, key=lambda x: (x['attribute_value']) )
    
    item_rating = add_parallel_to_rating(transformers_rating, unique_parallel)
    
    # Get Unique rating, this is required to prepare the output table record per rating
    unique_rating = get_unique(transformers_rating, 'attribute_value')
    
    # Get Planned Capacity for the fiscal year
    planned_capacity = get_planned_capacity(filters)
    
    # Final output
    final_data = get_final_data_records(filters, unique_rating, transformers_rating, delivery_note_items, schedule_lines, planned_capacity)
    
    return final_data

# Getting data for the chart 

def get_chart_data(i_planning_data, i_filters):
    def get_calander_week(i_date):
        date = frappe.utils.getdate(i_date)
        return(str(date.isocalendar()[1]))
        
    def get_planned_capacity(i_date):
        calander_year = frappe.utils.formatdate(i_date, format_string="YYYY")
        return frappe.get_all(
            'Planned Capacity Item', 
            fields = ('week', 'qty'),
            filters = {
                'parent': calander_year
            },
            order_by = 'week'
        )
    #>>ISS-2024-00035
    from_week = get_calander_week(i_filters.from_date)
    to_week = get_calander_week(i_filters.to_date)
    datasets = []
    labels = []
    
    # commented for the issue of not displaying correct planned data (# ISS-2024-00035)
    #planned_dataset = {}
    #planned_dataset['name'] = "Planned"
    #planned_dataset['values'] = list([d['qty'] for d in get_planned_capacity(i_filters.from_date)])
    #planned_dataset['chartType'] = 'line'
    #planned_dataset['type'] = 'line'
    #planned_data = []
    
    for wk in range(int(from_week),int(to_week)):
        labels.append(str(wk))
    
    for index, data in enumerate(i_planning_data):
        # Ignore Row Weekly Capacity and Parallel for stacked bar chart. It is already used in line chart
        # Stack all the power per week
       
        if data['power'] not in ['Parallel', 'Total']:
            values = []
            dataset = {}
            
            # get the data of the Row weekly capacity and display in line chart
            if data['power'] == 'Weekly Capacity':
                if i_filters.weekly_capacity == 1:
                    dataset['name'] = data['power']
                    dataset['chartType'] = 'line'
            #<<ISS-2024-00035
                        
                    for wk in range(int(from_week),int(to_week)):
                        values.append(data.get(str(wk))) 
                    #>> ISS-2024-00007
                        
                    dataset['values'] = values
                    
                    datasets.append(dataset)
                    #<< ISS-2024-00007
            else:
            
                dataset['name'] = data['power']
                dataset['chartType'] = 'bar'
                
                    
                for wk in range(int(from_week),int(to_week)):
                    values.append(data.get(str(wk)))     
                    
                dataset['values'] = values
                    
                datasets.append(dataset)
        
    
    #datasets.append(planned_dataset)
    
    chart_data = {
        "data": {
            "labels": labels,
            "datasets": datasets,
        },
        "yMarkers": [
        {
            "label": '',
            "value": 0,
            "type": 'solid'
        }
        ],
        "chartOptions": {
            "height": 40  # Adjust chart height as needed
        },
    "yMarkers": [{"label": "Marker", "value": "80", "options": {"labelPos": "left"}}],
        #"type": "axis-mixed",
        "barOptions": {"stacked": True},
        "colors": ['#db2777', '#ffa3ef', 'light-blue', '#854d0e', '#0891b2', '#8b5cf6', '#00008B', '#C0C0C0', '#FF69B4', '#2ecc71', '#e74c3c', '#f39c12', '#1abc9c', '#9b59b6', '#34495e', '#16a085', '#95a5a6', '#2c3e50', '#8e44ad', '#f5b041', '#c0392b', '#27ae60', '#3498db', '#d35400']
    }

    return chart_data
####
# Report Block
####

final_data = get_final_data(filters)
data = get_columns(filters), final_data, None, get_chart_data(final_data, filters)
#result = [final_data]

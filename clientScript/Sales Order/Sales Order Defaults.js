//Change References
//Set second language default as empty(Issue# : ISS-2024-00010) 
//>>ISS-2024-00010
frappe.ui.form.on('Sales Order', {
    // Setup
	//setup(frm) { 
	//Sometimes, the second documentation language is English.
	//In such cases, modify the onload event and also update the new form.
	onload: function(frm) {
	    //Only in the case the form is new
        //console.log('I am triggered onLoad from Sales Order defaults')  
        if (frm.is_new()) {	  
                  
	    //Second documentation language is link field and is pulling system defualt language as default language even 
	    //when the default is set with no value
	    //Manually setting it to blank so that this allows the Save without popping the not found error
	        frm.doc.second_language = '';
	        frm.refresh_fields();
        }
	},
});
//<<ISS-2024-00010
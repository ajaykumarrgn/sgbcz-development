cur_frm.cscript.custom_validate = function(doc) {
    var hv_in_kv = parseInt(doc.hv_rated_voltage)/1000
    // Trim trailing zeros if present(eg 3.40 to 3.4)
    //hv_in_kv = hv_in_kv.toString().replace(/\.?0+$/, '');
    
    var hv_in_kv_str = hv_in_kv.toString();

    // Remove trailing zeros after the decimal point
    hv_in_kv_str = hv_in_kv_str.replace(/(\.\d*?)0+$/, '$1');
    //Replace . with ,
    hv_in_kv = hv_in_kv_str.replace(/\./g, ",");
    
    // Generate document title based on field values
    var docTitle = 'DTTHZ2N ' + doc.rating + '/' + hv_in_kv.toString() + '/' + doc.lv_rated_voltage
	                        + '/' + doc.impedance + '/' + doc.li_phase_hv;
	
    //var docTitle = 'DTTHZ2N ' + doc.rating + '/' + hv_in_kv.toString() + '/' + doc.highest_operation_voltage_hv + '/' + doc.ac_phase_hv + '/' + doc.li_phase_hv + '/' + doc.lv_rated_voltage + '/' + doc.impedance;
    // Commenting to meet the new naming standard as on 22nd nov 23 bug 57 from the backlog sheet.
    // if(doc.k4_factor === 'Yes'){
    //     // Append 'K4' to the document title if k4_factor is 'Yes'
    //     docTitle  = docTitle + '/' + 'K4';
    // }
    
    // if(doc.ip_protection != 'IP00'){
    //     // Append IP protection value to the document title if it is not 'IP00'
    //     docTitle  = docTitle + '/' + doc.ip_protection;
    // }
//     if(doc.specifics){
//          // Append 'specifics' field value to the document title if it is present
//         docTitle  = docTitle + '/' + doc.specifics;
// 	}
	// Set the document title
	doc.title = docTitle;
	
	  
};
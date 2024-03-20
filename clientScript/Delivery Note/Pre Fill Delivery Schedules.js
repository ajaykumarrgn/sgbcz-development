frappe.ui.form.on('Delivery Note', {
    onload(frm) {
        // pre fill delivery schedule only for the first time
        if (!frm.is_new() || frm.doc.amended_from){
            return;
        }
            
        $.each(frm.doc.items || [], function(i,  item) {
            // only for parent items ie pos with multiple of 10
            if (item.pos % 10 === 0) {
                // Check serial numbers are filled then make an array 
                // per new line otherwise fill with empty array
                var tSerialNumbers = item.serial_no ? item.serial_no.split("\n") : [];
                for (let i = 0; i < item.qty ; i++) {
    		       frm.add_child('delivery_schedule', {
                    pos: item.pos,
                    item_code: item.item_code,
                    serial_number: tSerialNumbers[i] ? tSerialNumbers[i] : '',
                    status: 'Purchasing',
                    delivery_date: item.delivery_date,
                    oa_confirmed_date: item.delivery_date,
                });
                }
            }
        });
    },
	refresh(frm) {
		// your code here
	},
	validate(frm, cdt, cdn) {
	    
	}
})

frappe.ui.form.on('Delivery Schedule', {
	refresh(frm) {
		// your code here
	}
})

frappe.ui.form.on('Delivery Note Item', {
	qty(frm, cdt, cdn) {
	    var item = locals[cdt][cdn];
	    //var tSerialNumbers = item.serial_no ? item.serial_no.split("\n") : [];
	    if( item.qty > frm.doc.delivery_schedule.length ) {
            for (let i = frm.doc.delivery_schedule.length; i < item.qty ; i++) {
    		    frm.add_child('delivery_schedule', {
                    pos: item.pos,
                    serial_number: 'Not available',
                    status: 'Purchasing',
                    delivery_date: item.delivery_date,
                    oa_confirmed_date: item.delivery_date,
                });
                } 
	    } else { 
	        frm.doc.delivery_schedule.splice(item.qty);
	        frm.refresh_fields();
	    }
	}, // qty
/*	serial_no(frm, cdt, cdn) {
	    var item = locals[cdt][cdn];
	    var tSerialNumbers = item.serial_no ? item.serial_no.split("\n") : [];
	    console.log('from Serial number change', tSerialNumbers)
	     $.each(tSerialNumbers || [], function(i,  serialNumber) {
	          console.log('from Serial number change iterator', frm.doc.delivery_schedule[i])
	         frm.doc.delivery_schedule[i].serial_number = serialNumber
	     });
	     frm.refresh_fields();
	} */
});
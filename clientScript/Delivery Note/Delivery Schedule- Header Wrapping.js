frappe.ui.form.on('Delivery Note', {
    refresh(frm) {
        // your code here
        
    }
});

const style = document.createElement('style');
style.innerHTML = `
    .grid-heading-row {
        border-bottom: 1px solid var(--table-border-color);
        color: var(--text-muted);
        font-size: 12px;
        text-align: left;
        line-height: 13px; /* Adjust this value to increase the height */
        overflow: visible; /* Hide overflow content */
        text-overflow: initial; /* Display ellipsis for overflow */
    }
`;
document.head.appendChild(style);
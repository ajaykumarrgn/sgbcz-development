SELECT 
    so.territory AS 'Territory',
    COUNT(si.item_code) AS 'Number of Items',
    SUM(so.total) AS 'Total'
FROM 
    `tabSales Order` so
INNER JOIN 
    `tabSales Order Item` si ON so.name = si.parent
LEFT JOIN 
    `tabItem` i ON si.item_code = i.name
WHERE 
    i.item_group = 'DTTHZ2N' 
GROUP BY 
    so.territory;

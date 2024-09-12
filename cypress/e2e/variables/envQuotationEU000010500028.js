/* eslint-disable */
export const source = 'https://qsgbcz.lmnas.com/login';
export const target = 'https://qsgbcz.lmnas.com/app/quotation';
export const date = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}).replace(/\//g, '.');
export const orderType = 'Sales';
const today = new Date();
const validTillDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
const dd = String(validTillDate.getDate()).padStart(2, '0');
const mm = String(validTillDate.getMonth() + 1).padStart(2, '0'); // January is 0!
const yyyy = validTillDate.getFullYear();
export const validTill = `${dd}.${mm}.${yyyy}`;
export const quotationTo = 'Customer';
export const requestDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}).replace(/\//g, '.');
export const projectName = 'Test Automate'
export const customerName = 'ABB AG';
export const currency = 'EUR';
export const priceList = 'Germany Selling';
export const customerAddress = 'ABB AG-Billing';
export const address = `Kallstadter Straße 1\n68309 Mannheim`;
export const contactPerson = 'Asam Giovanni-ABB AG';
export const shippingAddress = 'ABB AG-Billing';
export const incoterms = 'DAP - Delivered At Place';
export const paymentTerms = 'Within 30 days after delivery without deduction';
export const terms = 'Offer Condition_de';
export const itemCode = 'DTTHZ2N 1000/7,45/435/6/75';
export const quantity = '1,00';
export const rate = '19.970,00';
export const amount = '19.970,00';
export const totalQuanty = '1';
export const totalCost = '19.970,00';
export const grandTotal = '19.970,00';
export const roundedTotal = '19.970,00';
export const salesTax = 'Czech Republic VAT 15%';
export const taxType = 'On Net Total';
export const taxAccounthead = 'VAT 15% - SGBCZ';
export const taxRate = '15';
export const taxAmount = '2.995,50';
export const taxTotal = '22.965,50';
export const totalTaxandCharge = '2.995,50';
export const grandTotalwithTax = '22.965,50';
export const roundedTotalwithTax = '22.965,50';
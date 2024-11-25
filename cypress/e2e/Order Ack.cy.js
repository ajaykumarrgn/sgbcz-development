describe('qsgbcz Sales Order', () => {
  beforeEach(() => {
    // Read data from the Excel file
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envOrderAckEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
        Cypress.log({message:'excel data loaded',log:false});
        cy.wrap(data, {log:false}).as('testdata');
  });
});
it('Order ack and conf', () => {
  // Sequence 1
  // Login  
      cy.get('@testdata').then((testdata) => {
      const url = testdata[0].Value;
      const target = testdata[1].Value;
      cy.visit(url); 
      const username = Cypress.env('username');
      const password = Cypress.env('password');
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname',{timeout:20000}).should('include', '/app');
   
// Go to the slaes order with filter status equal to bill 
      cy.visit(target); 
      cy.wait(3000);
      cy.get('[data-original-title="Print"]').click(); //print
     
      
  
//Go to the order Confirmation and check 
      cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
        .select(testdata[2].Value) 
        .should('have.value', testdata[2].Value);
      cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('be.visible')
        .and('contain', 'Order Number:')
        .and('contain', 'Contact person:')
        .and('contain', 'Telefon:')
        .and('contain', 'E-mail:')
        .and('contain', 'Bestätigungsdatum:')
        .and('contain', 'Date of delivery:') 
        .and('contain', "Customer's PO number:")
        .and('contain', 'Lucie Gazdová')
        .and('contain', 'Your contact person for technical issues:')
        .and('contain', 'Your contact person for logistic issues:')
        .and('contain', 'Gewährleistung: 18 Monate ab Inbetriebnahme, längstens jedoch 24 Monate nach Lieferung.');
//Go to the Order Ack
     cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
       .select(testdata[3].Value) 
       .should('have.value', testdata[3].Value);
     cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
       .should('be.visible')
       .and('contain', 'Order Number:') 
       .and('contain', 'Kontaktperson:') 
       .and('contain', 'Telefon:') 
       .and('contain', 'E-mail:') 
       .and('contain', 'Document date:') 
       .and('contain', 'Lucie Gazdová')
       .and('contain', 'Gewährleistung: 18 Monate ab Inbetriebnahme, längstens jedoch 24 Monate nach Lieferung.');

      });
  });
  });
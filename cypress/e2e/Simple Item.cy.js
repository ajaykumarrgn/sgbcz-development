describe('Qsgbcz Simple Item Creation', () => {
  beforeEach(() => {
  // Read data from the Excel file
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envSimple ItemEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
        Cypress.log({message:'excel data loaded',log:false});
        cy.wrap(data, {log:false}).as('testdata');
    });
});
it('Item Creation Flow', () => {
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
      cy.visit(target); //use filter item group = others
      cy.get('.primary-action > .hidden-xs > .alt-underline').click(); 
      cy.wait(1000);
      cy.get('.custom-actions > .btn').click(); //Edit full form
      cy.wait(1000);
      cy.get('#item-details > :nth-child(1) > .section-body > :nth-child(1) > form > div[data-fieldname="item_code"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().type(testdata[2].Value).wait(2000); //Item code 
      cy.get('#item-details > :nth-child(1) > .section-body > :nth-child(1) > form > div[data-fieldname="item_group"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').type(testdata[3].Value,'enter'); //Item group
      cy.get('#page-Item > .page-head > .container > .row > .col-md-4 > .fill-width > :nth-child(1) > .flex > .ellipsis').click();
      cy.get('.primary-action > .alt-underline').click(); //Save the Item
      // cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click(); //Dropdown Menu
      // cy.get(':nth-child(12) > .grey-link').click(); //Delete the Item
        
      
     

      
  });
});
})
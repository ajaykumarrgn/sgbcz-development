describe('qsgbcz Design ', () => {
  beforeEach(() => {
    // Read data from the Excel file
    cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envDesignEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
        Cypress.log({ message: 'Excel data loaded', log: false });
        cy.wrap(data, { log: false }).as('testdata');
    });
  });

  it('Adding the Design', () => {
    // Main test steps
    cy.get('@testdata').then((testdata) => {
      const url = testdata[0].value; // Source URL
      const target = testdata[1].value; // Design URL
      const target2 = testdata[5].value; // Performe calculation filter

      cy.visit(url); 
      const username = Cypress.env('username');
      const password = Cypress.env('password');
      cy.get('#login_email').type(username);
      cy.get('#login_password').type(password);
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
      cy.location('pathname', { timeout: 20000 }).should('include', '/app');
      cy.visit(target);
     
      cy.get('.primary-action > .hidden-xs').click();
      cy.get(':nth-child(2) > .section-body > :nth-child(1) > form > .form-group.frappe-control > .checkbox > label > .input-area > .input-with-feedback')
        .click()
        .wait(1000);
      cy.wait(2000);
      cy.get('.btn-modal-close').click();
      cy.wait(2000);
      
      cy.get('div[data-fieldname="hv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click()
        .wait(2000)
        .type(testdata[2].value, '{enter}');
        
      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click()
        .wait(2000)
        .type(testdata[3].value, '{enter}');
      
      cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .type(testdata[4].value, '{enter}');
      cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click().wait(1000)
      
      //cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();     //Should be perform calculation status
      cy.get('.custom-actions > .btn').click().wait(2000);
// delete the design
      cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click();
      cy.wait(1000);
      cy.get(':nth-child(9) > .grey-link').click();
      cy.wait(1000);
      cy.get('.modal.show > .modal-dialog > .modal-content > .modal-footer > .standard-actions > .btn-primary').click();        
    });
  });
});
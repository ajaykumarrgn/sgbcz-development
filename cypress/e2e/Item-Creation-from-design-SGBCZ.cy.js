describe('SGBCZ non is design item creation', () => {
  beforeEach(() => {
      cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-AEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => {
          Cypress.log({ message: 'excel data loaded', log: false });
          // Store the loaded Excel data in Cypress environment variables (or directly within the test)
          Cypress.env('testData', testdata);
          const url = testdata[0].value;
          const target = testdata[1].value;
          cy.visit(url);
          const username = Cypress.env('username');
          const password = Cypress.env('password');
          cy.get('#login_email').type(username);
          cy.get('#login_password').type(password);
          cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
          cy.location('pathname', { timeout: 20000 }).should('include', '/app');
      });
  });
  describe('Creating Item From Design', () => {
    it('Create Item Button should not clickable before save', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.get('.primary-action').click().wait(5000);
        cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .click();
        cy.wait(2000); // Adjust this time as needed based on your page's behavior
        cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .type(testdata[6].value);
        cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
          .click().wait(1000).type(testdata[11].value).wait(1000);
        cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[21].value);
        cy.get('#design-item_tab-tab').click();
        cy.get('div[data-fieldname="direct_material_cost"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().clear().wait(1000).type(testdata[20].value);
        cy.get('#page-Design > .page-head > .container > .row > .col > .custom-actions')
          .should('not.be.visible');
    });
    it('Create Item Button should be Visible After save', () => {
      const testdata = Cypress.env('testData');
      const target = testdata[1].value;
      cy.visit(target);
      cy.get('.primary-action').click().wait(5000);
      cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click();
      cy.wait(2000); // Adjust this time as needed based on your page's behavior
      cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .type(testdata[6].value);
      cy.get('div[data-fieldname="lv_rated_voltage"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
        .click().wait(1000).type(testdata[11].value).wait(1000);
      cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[21].value);
      cy.get('#design-item_tab-tab').click();
      cy.get('div[data-fieldname="direct_material_cost"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().clear().wait(1000).type(testdata[20].value);
      cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();
      cy.get('#page-Design > .page-head > .container > .row > .col > .custom-actions')
      .should('be.visible');
      cy.get('#page-Design > .page-head > .container > .row > .col > .custom-actions').click();
      cy.get('.modal-header > .fill-width').should('be.visible');
      cy.wait(4000);
        });
      });
  describe('View the Item', () => {
      it('Should check the Item is Created in the Design', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.get('#design-item_tab-tab').click();
        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').should('be.visible');

      });
      it('Should view the Item from the Design', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.get('#design-item_tab-tab').click();
        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();
        cy.wait(2000);
      });
    });
  describe('Check the Specifies and Attachments', () => {
      it('Should check the Specifies', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.get('#design-item_tab-tab').click();
        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();
        cy.wait(2000);
        cy.get('#item-details > :nth-child(2) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[21].value);
      });
      // it('Should check the Attachments', () => {
      //   const testdata = Cypress.env('testData');
      //   cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
      //   cy.get('#design-item_tab-tab').click();
      //   cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();
      //   cy.wait(2000);
        // cy.get('#page-Item > .page-body > .page-wrapper > .page-content > .layout-main > .col-lg-2 > .form-sidebar > .form-attachments > .attachments-actions')
        //   .children()  // Select all child elements
        //   .should('have.length', 0);  // Assert that there are no child elements

      // });
    });
    describe('Tear off', () => {
      it('Should Remove the Design from the Item', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.wait(2000);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.wait(3000);
        cy.get('#design-item_tab-tab').click();
        cy.wait(3000);
        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();
        cy.wait(2000);
        cy.get(':nth-child(4) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
          .click({force: true})
          .clear({force: true})
          .type('{selectall}{backspace}', {force: true}) // Clear by selecting all and deleting
          .invoke('val', '') // Explicitly set the value
          .trigger('input'); // Trigger the input event
        cy.get('#item-details > :nth-child(4) > .section-head').click()
        // cy.wait(30000)
        cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();
        cy.wait(20000)
        // cy.go('back');
    });
      it('Should Delete the Design', () => {
        const testdata = Cypress.env('testData');
        const target = testdata[1].value;
        cy.visit(target);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
        cy.wait(3000)
        cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click({force:true});
        cy.get(':nth-child(11) > .grey-link').click({force:true}).wait(2000); //Delete the design
        cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes
        cy.wait(3000)
        // cy.get('.btn-modal-close').click({force:true}).wait(2000);
  });
      it('Should Delete the Item', () => {
        const testdata = Cypress.env('testData');
        cy.visit(testdata[22].value);
        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .select-like > .list-row-checkbox').click();
        cy.get('.actions-btn-group > .btn > :nth-child(1)').click();
        cy.get('.actions-btn-group > .dropdown-menu > :nth-child(7) > .grey-link > .menu-item-label').click({force:true});
        cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true});
        cy.wait(3000)
    });
    });

});
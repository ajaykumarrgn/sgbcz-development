describe('Checking Creation of Item from Design NEU', () => {

  beforeEach(() => {

      cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envItem-Creation-from-Design-BEU000010500028.xlsx', sheetName: 'Sheet1' }).then((testdata) => {

          Cypress.log({ message: 'excel data loaded', log: false });

          Cypress.env('testData', testdata);

          const url = testdata[0].Value;

          const target = testdata[1].Value;

          cy.visit(url);

          const username = Cypress.env('username');

          const password = Cypress.env('password');

          cy.get('#login_email').type(username);

          cy.get('#login_password').type(password);

          cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();

          cy.location('pathname', { timeout: 20000 }).should('include', '/app');

          cy.visit(target);

      });

  });

  describe('Creating Item From Design for NEU factory', () => {

      it('Create Item button should disabled before saving the design', () => {

          const testdata = Cypress.env('testData');

          cy.get('.primary-action').click().wait(5000);

          cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory

          cy.get('#design-__details > :nth-child(3) > .section-head').click();

          cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(4000);

          cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000

          cy.get('#design-__details > :nth-child(3) > .section-head').click();

          cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);

          cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300

          cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[69].Value).wait(4000);

          cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > div[data-fieldtype="Select"] > .form-group > .clearfix > .control-label').click();

          cy.url().then((currentUrl) => {

          cy.get('#page-Design > .page-head > .container > .row > .col > .custom-actions')

            .click({ force: true }) 

            .then(() => {

              cy.url().should('eq', currentUrl); // URL should remain unchanged

            });});

      });

      it('Create Item Button should be Visible after saving the design', () => {

        const testdata = Cypress.env('testData');

        cy.get('.primary-action').click().wait(5000);

        cy.get(':nth-child(1) > form > div[data-fieldtype="Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback').click().clear().wait(500).type(testdata[2].Value).wait(4000); //factory

        cy.get('#design-__details > :nth-child(3) > .section-head').click();

        cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(4000);

        cy.get(':nth-child(3) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[5].Value,'{enter}').wait(3000); //enter the correct hv value 3000

        cy.get('#design-__details > :nth-child(3) > .section-head').click();

        cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').click().wait(1000);

        cy.get(':nth-child(4) > .section-body > :nth-child(1) > form > [data-fieldtype="HTML"] > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[34].Value,'{enter}').wait(3000); //enter the correct lv value 300

        cy.get(':nth-child(7) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').type(testdata[69].Value).wait(4000);

        cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();//Save and click the create item

        cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();

        cy.get('.custom-actions > .btn').click()

        cy.wait(6000);

      });

  });
  describe('View the Item', () => {

      it('Should check the Item is Created in the Design', () => {

        const testdata = Cypress.env('testData');

        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();

        cy.get('#design-item_tab-tab').click();

        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').should('be.visible').should('not.be.empty');

      });

      it('Should view the Item from the Design', () => {

        const testdata = Cypress.env('testData');

        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();

        cy.get('#design-item_tab-tab').click();

        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();

        cy.wait(2000);

      });

  });
  describe('Check the Specifies and Attachments', () => {

      it('Should check the Specifies', () => {

        const testdata = Cypress.env('testData');

        cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();

        cy.get('#design-item_tab-tab').click();

        cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();

        cy.wait(2000);

        cy.get('#item-details > :nth-child(2) > .section-body > :nth-child(2) > form > .frappe-control > .form-group > .control-input-wrapper > .control-value').should('have.text',testdata[69].Value);

      });
  });
describe('Tear off', () => {

    it('Should Remove the item from the Design', () => {

      const testdata = Cypress.env('testData');

      cy.wait(2000);

      cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();

      cy.get('#design-item_tab-tab').click();

      cy.get('[data-fieldname="item"] > .form-group > .control-input-wrapper > .control-value > a').click();

      cy.wait(2000);

      cy.get(':nth-child(4) > .section-body > .form-column > form > .frappe-control > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')

        .click({force: true})

        .clear({force: true})

        .type('{selectall}{backspace}', {force: true}) // Clear by selecting all and deleting

        .invoke('val', '') // Explicitly set the value

        .trigger('input'); // Trigger the input event

        // cy.get('#item-details > :nth-child(4) > .section-head').click()

        // cy.wait(30000)

        cy.get('#page-Item > .page-head > .container > .row > .col > .standard-actions > .primary-action').click();

        cy.wait(20000)

      // cy.go('back');

    });

    it('Should Delete the Design', () => {

      cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();

      cy.wait(3000)

      cy.get('#page-Design > .page-head > .container > .row > .col > .standard-actions > .menu-btn-group > .btn').click({force:true});

      cy.get(':nth-child(11) > .grey-link').click({force:true}).wait(2000); //Delete the design

      cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true}).wait(3000); //yes

      cy.wait(3000)

      //cy.get('.btn-modal-close').click({force:true}).wait(2000);

    });

    it('Should Delete the Item', () => {

      const testdata = Cypress.env('testData');

      cy.visit(testdata[70].Value);

      cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .select-like > .list-row-checkbox').click();

      cy.get('.actions-btn-group > .btn > :nth-child(1)').click();

      cy.get('.actions-btn-group > .dropdown-menu > :nth-child(7) > .grey-link > .menu-item-label').click({force:true}).wait(2000);

      cy.get('.modal-footer > .standard-actions > .btn-primary').click({force:true});

      cy.wait(3000)

    });

});

});
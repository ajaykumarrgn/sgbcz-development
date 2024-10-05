describe('CZ Quotation Workflow Testing', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // Read the Excel file and store data in a Cypress alias
    cy.task('readExcelFile', { filePath: './cypress/e2e/variables/envWork FlowEU000010500028.xlsx' }).then((data) => {
    cy.wrap(data).as('testData');
    });
  });
  

 // Segment-1
 //Self Approved Functionality
  it('Self Approved ',{ retries: 3 }, function () {
    // Read the login URL, email, and password from the Excel data
    const loginURL = this.testData.find(row => row.Field === 'URL').Value;
    const loginEmail = this.testData.find(row => row.Field === 'Email').Value;
    const loginPassword = this.testData.find(row => row.Field === 'Password').Value;

    cy.visit(loginURL);

    cy.get(`#login_email`).click({ multiple: true }).first().type(loginEmail);
    cy.get('#login_password').first().type(loginPassword);
    cy.get('.form-signin > :nth-child(1) > .page-card-actions > .btn').click({ multiple: true });
    cy.wait(10000);

    cy.get('[item-name="Offer"] > .desk-sidebar-item > .item-anchor > .sidebar-item-label').click({ multiple: true });
    cy.get('[shortcut_name="Quotations"] > .widget').click({ multiple: true });
    cy.get('.primary-action > .hidden-xs').click({ multiple: true });
    cy.wait(1000);
    
    // Read and use form field values from the Excel data
    const field1Value = this.testData.find(row => row.Field === 'Field1').Value;
    cy.get(':nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
      .first() 
      .click({ force: true })
      .first()
      .type(field1Value + '{Enter}') // Field1
      .wait(500)
      .first()
      .type('{enter}', { force: true });

    cy.wait(2000);
    const field2Value = this.testData.find(row => row.Field === 'Field2').Value;
    cy.get('div[data-fieldtype="Dynamic Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
      .first()
      .click({ force: true })
      .first()
      .type(field2Value , { force: true }) // Field2
      .wait(500)
      .first()
      .type('{enter}', { force: true });

    cy.wait(4000);

      // Read and format the date from the current date, adding 4 days
    const currentDate = new Date();
    const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 4));

    // Function to format date based on the expected format
    const formatDate = (date, format) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (format === 'dd-mm-yyyy') {
      return `${day}-${month}-${year}`;
    } else if (format === 'dd.mm.yyyy') {
      return `${day}.${month}.${year}`;
    } else {
      throw new Error('Unsupported date format');
    }
  };

// Determine the expected format (you might need to customize this logic based on the page or test case)
    const expectedFormat = 'dd-mm-yyyy'; // or 'dd.mm.yyyy' based on the format you need

    // Format the date according to the expected format
    const formattedDate = formatDate(futureDate, expectedFormat);
    cy.wait(2000);
    // Clear the date input field and enter the new formatted date with force option
    cy.get('.has-error > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').wait(500)
      .clear()  // Clear any existing date
      .click({ multiple: true }).wait(3000)  // Open the date picker
      .first()
      .type(formattedDate + '{Enter}', { force: true }).wait(1000); // Enter the new formatted date with high force


    cy.wait(2000);
    const field4Value = this.testData.find(row => row.Field === 'Field4').Value;
    cy.get('.rows > .grid-row > .data-row > .col-xs-4').click({ multiple: true });
    cy.get('.field-area > .form-group > .link-field > .awesomplete > .input-with-feedback')
      .click({ multiple: true }).first().type(field4Value + '{Enter}').wait(3000);
    cy.wait(2000);
    // Submitting
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({ force: true });
    cy.wait(10000);
    cy.reload();
    cy.wait(10000);
    cy.scrollTo('top');
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .btn').click({ force: true });
    //cy.wait(8000);
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .dropdown-menu > :nth-child(1) > .grey-link', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .click({ force: true });
    cy.wait(10000);
    //cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .dropdown-menu > :nth-child(1) > .grey-link').click({ force: true });
  });

  //Segment-2
  //Approval request send to user above L0
  it('Quotaion Request from  L0 User',{ retries: 3 }, function () {
    // Read the login URL, email, and password from the Excel data
    const loginURL = this.testData.find(row => row.Field === 'URL').Value;
    const loginEmail = this.testData.find(row => row.Field === 'Email').Value;
    const loginPassword = this.testData.find(row => row.Field === 'Password').Value;
    

    cy.visit(loginURL);

    cy.get(`#login_email`).click().type(loginEmail);
    cy.get('#login_password').type(loginPassword);
    cy.get('.form-signin > :nth-child(1) > .page-card-actions > .btn').click();
    cy.wait(10000);
    cy.get('[item-name="Offer"] > .desk-sidebar-item > .item-anchor > .sidebar-item-label').click();
    cy.get('[shortcut_name="Quotations"] > .widget').click();
    cy.get('.primary-action > .hidden-xs').click();
    cy.wait(1000);
    
    // Read and use form field values from the Excel data
    const field1Value = this.testData.find(row => row.Field === 'Field1').Value;
    cy.get(':nth-child(3) > form > div[data-fieldtype="Data"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
      .first() 
      .click({ force: true })
      .first()
      .type(field1Value + '{Enter}') // Field1
      .wait(500)
      .first()
      .type('{enter}', { force: true });

    cy.wait(2000);
    const field2Value = this.testData.find(row => row.Field === 'Field2').Value;
    cy.get('div[data-fieldtype="Dynamic Link"] > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback')
      .first()
      .click({ force: true })
      .first()
      .type(field2Value , { force: true }) // Field2
      .wait(500)
      .first()
      .type('{enter}', { force: true });

    cy.wait(4000);
    // Read and format the date from the current date, adding 4 days
    const currentDate = new Date();
    const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 4));

    // Function to format date based on the expected format
    const formatDate = (date, format) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (format === 'dd-mm-yyyy') {
      return `${day}-${month}-${year}`;
    } else if (format === 'dd.mm.yyyy') {
      return `${day}.${month}.${year}`;
    } else {
      throw new Error('Unsupported date format');
    }
    };

    // Determine the expected format (you might need to customize this logic based on the page or test case)
    const expectedFormat = 'dd-mm-yyyy'; // or 'dd.mm.yyyy' based on the format you need

    // Format the date according to the expected format
    const formattedDate = formatDate(futureDate, expectedFormat);
    cy.wait(2000);
    // Clear the date input field and enter the new formatted date with force option
    cy.get('.has-error > .form-group > .control-input-wrapper > .control-input > .input-with-feedback').wait(500)
      .clear()  // Clear any existing date
      .click({ multiple: true }).wait(3000)  // Open the date picker
      .first()
      .type(formattedDate + '{Enter}', { force: true }).wait(1000); // Enter the new formatted date with high force


    cy.wait(2000);
    const field4Value = this.testData.find(row => row.Field === 'Field4').Value;
    cy.get('.rows > .grid-row > .data-row > .col-xs-4').click({ multiple: true });
    cy.get('.field-area > .form-group > .link-field > .awesomplete > .input-with-feedback')
      .click({ multiple: true }).first().type(field4Value + '{Enter}').wait(3000);
    cy.wait(2000);
    const field5Value = this.testData.find(row => row.Field === 'Field5').Value;
    cy.get('.col-xs-1.bold > .field-area > .form-group > .input-with-feedback').dblclick()
      .clear({ force: true })  // Clear any existing value with force option
      .type(field5Value + '{Enter}', { force: true }); // Field5 with force option
    cy.wait(2000);
    const field6Value = this.testData.find(row => row.Field === 'Field6').Value;
    cy.get(':nth-child(10) > .section-head').click();
    cy.get(':nth-child(10) > .section-body > :nth-child(2) > form > div[data-fieldtype="Float"] > .form-group > .control-input-wrapper > .control-input > .input-with-feedback')
      .type(field6Value, { force: true });

    // Submit and click actions
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .primary-action').click({ force: true });
    cy.wait(10000);
    cy.reload();
    cy.wait(10000);
    cy.scrollTo('top');
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .btn').click({ force: true });
    // cy.wait(8000);
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .dropdown-menu > :nth-child(1) > .grey-link', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .click({ force: true });
    cy.wait(10000);
    cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .btn').should('not.visible');
    cy.wait(10000);
  });

  //Segment-3
  //Checking the Privelege of other users
  // Utility functions defined once
  function getUserCredentialsByField(fieldPrefix, testData) {
    const emailField = `${fieldPrefix}`;
    const passwordField = `${fieldPrefix.replace('Email', 'Password')}`;

    const emailData = testData.find((item) => item.Field === emailField);
    const passwordData = testData.find((item) => item.Field === passwordField);

    return emailData && passwordData ? { email: emailData.Value, password: passwordData.Value } : null;
  }

  function getValueByField(field, testData) {
    const fieldData = testData.find((item) => item.Field === field);
    return fieldData ? fieldData.Value : null;
  }

  it('Checking the previlages of L1, L2 and L3 Users',{ retries: 3 }, function () {
    // Fetch the URL from test data
    const siteURL = getValueByField('URL', this.testData);

    // Debugging log
    cy.log('Navigating to URL:', siteURL);

    if (!siteURL || siteURL === 'about:blank') {
      throw new Error('Invalid URL provided in the test data.');
    }

    // List of email fields to process
    const emailFields = ['Email2', 'Email3'];

    emailFields.forEach((emailField) => {
      // Fetch credentials based on the email field
      const userCredentials = getUserCredentialsByField(emailField, this.testData);
      if (!userCredentials) {
        throw new Error(`${emailField} not found in the provided test data`);
      }

      // Login using fetched credentials
      cy.wait(1000);
      cy.visit(siteURL);
      cy.get('#login_email').click().type(userCredentials.email, { force: true });
      cy.get('#login_password').click().type(userCredentials.password, { force: true });
      cy.get('.form-signin > :nth-child(1) > .page-card-actions > .btn').click();

      // Perform post-login actions or verifications as needed
      cy.wait(1000);

      // Navigate to the Quotations section and open a quotation
      cy.get('[item-name="Offer"] > .desk-sidebar-item > .item-anchor').click();
      cy.get('[shortcut_name="Quotations"] > .widget').click();
      cy.get('[href="/app/quotation"]').click();
      cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .bold > .ellipsis').click();
      cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .btn')
        .should('be.visible');

      // Special behavior for L3 (Email3)
      if (emailField === 'Email3') {
        // Perform the approval step for L3 user
        // cy.get(':nth-child(3) > .list-row > .level-left > .list-subject > .select-like > .list-row-checkbox').click();  // Approval button (modify selector if needed)
        cy.wait(1000);
        cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .btn').click();
        cy.get('#page-Quotation > .page-head > .container > .row > .col > .standard-actions > .actions-btn-group > .dropdown-menu > :nth-child(1) > .grey-link').click();
        cy.log('Approval action completed for L3 user.');

        // Do not log out for L3
      } else {
        // Logout for Email1 and Email2
        cy.get('.nav-link > .avatar > .avatar-frame').click();
        cy.get('[onclick="return frappe.app.logout()"]').click();
        cy.log(`${emailField} user logged out.`);
        }
      });
    });
    
  });

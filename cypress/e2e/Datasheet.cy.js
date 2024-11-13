describe('Design Data Sheet', () => {
  beforeEach(() => {
    // Load data from an Excel file and store it for use in tests
    cy.task('readExcelFile', { 
      filePath: 'cypress/e2e/variables/envDesignEU000010500028.xlsx', 
      sheetName: 'Sheet1' 
    }).then((data) => {
        // Log message confirming Excel data was loaded, without outputting it in the console
        Cypress.log({ message: 'Excel data loaded', log: false });
        // Store loaded data in an alias called 'testdata' for use across the test
        cy.wrap(data, { log: false }).as('testdata');
    });
  });

  it('Checking the Vectar Group', () => {
    // Main test steps for adding a design
    cy.get('@testdata').then((testdata) => {
      // Retrieve URLs for source and target from Excel data
      const url = testdata[9].value; // Source URL
      const target = testdata[10].value; // Design URL

      // Visit the source URL
      cy.visit(url); 

      // Retrieve login credentials from Cypress environment variables
      const username = Cypress.env('username');
      const password = Cypress.env('password');

      // Enter login credentials and submit login form
      cy.get('#login_email').type(username); // Type in username
      cy.get('#login_password').type(password); // Type in password
      cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click(); // Click login button

      // Verify that login was successful by checking if the current URL includes '/app'
      cy.location('pathname', { timeout: 20000 }).should('include', '/app');

      // Navigate to the target URL and wait for 4 seconds for the page to load
      cy.visit(target).wait(4000);

      // Interact with the search field to enter a specific value from the test data
      cy.get('.awesomplete > .input-with-feedback')
        .clear({ force: true }) // Clear the input field
        .type(testdata[12].value, { force: true }) // Type value from Excel data
        .type('{enter}', { force: true }) // Press Enter to submit the input
        .wait(5000); // Wait 5 seconds for the page to process the input

      // Check for specific vector values in the iframe to verify that expected content is present
      cy.get('.print-format-container')
        .its('0.contentDocument.body') // Access the body of the iframe
        .should('be.visible') // Verify the iframe is visible
        .and('contain', 'D'); // Check that the iframe contains the text 'D'

      cy.get('.print-format-container')
        .its('0.contentDocument.body') // Access the body of the iframe
        .should('be.visible') // Verify the iframe is visible
        .and('contain', 'yn1'); // Check that the iframe contains the text 'yn1'
    });
  });
});
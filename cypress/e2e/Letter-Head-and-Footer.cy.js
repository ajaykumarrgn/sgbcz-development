describe('Letter Head and Footer for all factories', () => {
    beforeEach(() => {
      // Read data from the Excel file
          cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envLetter-Head-and-FooterEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {  
          Cypress.log({message:'excel data loaded',log:false});
          cy.wrap(data, {log:false}).as('testdata');
          cy.get('@testdata').then((testdata) => {
            const url = testdata[0].Value;
            cy.visit(url); 
            const username = Cypress.env('username');
            const password = Cypress.env('password');
            cy.get('#login_email').type(username);
            cy.get('#login_password').type(password);
            cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click();
            cy.location('pathname',{timeout:20000}).should('include', '/app');
          })
    });
  });
  describe('SGBCZ Letter Head', () => {
    it('Should have SGBCZ in the letter head filter', () => {
      cy.get('@testdata').then((testdata) => {
      const target = testdata[1].Value;
      cy.visit(target); 
      cy.wait(3000);
      cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
          .select(testdata[3].Value) 
          .should('have.value', testdata[3].Value);
      cy.wait(3000)
      cy.get('.awesomplete > .input-with-feedback').should('have.value', testdata[4].Value)
    })
    })
    it('Should have the SGBCZ logo at top right corner', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[1].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
          .should('be.visible')
          .find('img') // Find the image inside the body
          .should('have.attr', 'src') // Assert that it has a src attribute
          .and('include', testdata[5].Value); // Assert that src includes the logo path
        cy.get('.print-format-container', { timeout: 10000 })
          .its('0.contentDocument.body', { timeout: 10000 })
          .find('img') // Re-select the logo image
          .then(($img) => {
            const position = $img[0].getBoundingClientRect();
            expect(position.top).to.be.closeTo(0, 50); // Top position should be near 0
            expect(position.right).to.be.closeTo(window.innerWidth, 800);
          })
        })
      })
     
    it('Should have SGBCZ company details in top left', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[1].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap the body for Cypress commands
        .find('.col-xs-4.column-break') // Locate the target element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get element's position
          
          // Assert the top-left position
          expect(position.top).to.be.closeTo(0, 50); // Top position near 0
          expect(position.left).to.be.closeTo(0, 60); // Left position near 0
        });

      })
    })
    it('Should have correct SGBCZ company address', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[1].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[6].Value)
        .and('contain', testdata[7].Value)
        .and('contain', testdata[8].Value)
        .and('contain', testdata[9].Value)
        .and('contain', testdata[10].Value)
        .and('contain', testdata[11].Value)

      })
    })
    
  })
    describe('SGBCZ Footer', () => {
      it('Should footer be at bottom center', () => {
        cy.get('@testdata').then((testdata) => {
          const target = testdata[1].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap iframe body
        .find('#footer-sgbcz') // Target the footer element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get the element's position
          const parentWidth = $el[0].offsetParent.clientWidth; // Get the width of the parent container
          // Assert it's near the bottom of the iframe
          expect(position.bottom).to.be.closeTo(window.innerHeight, 2500); // Footer close to the bottom
          // Assert it's horizontally centered
          expect(position.left + position.width / 2).to.be.closeTo(parentWidth / 2, 10); // Centered horizontally
        });

      })

      })
      it('Should have correct SGBCZ management director and address at the footer', () => {
        cy.get('@testdata').then((testdata) => {
        const target = testdata[1].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[6].Value)
        .and('contain', testdata[7].Value)
        .and('contain', testdata[8].Value)
        .and('contain', testdata[9].Value)
        .and('contain', testdata[10].Value)
        .and('contain', testdata[11].Value)
        .and('contain', testdata[12].Value)

      })

      })
    })
  describe('SGB RGB Letter Head', () => {
    it('Should have SGB RGB in the letter head filter', () => {
      cy.get('@testdata').then((testdata) => {
      const target = testdata[13].Value;
      cy.visit(target); 
      cy.wait(3000);
      cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
          .select(testdata[3].Value) 
          .should('have.value', testdata[3].Value);
      cy.wait(3000)
      cy.get('.awesomplete > .input-with-feedback').should('have.value', testdata[14].Value)
    })
    })
    it('Should have the SGB RGB logo at top right corner', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[13].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
          .should('be.visible')
          .find('img') // Find the image inside the body
          .should('have.attr', 'src') // Assert that it has a src attribute
          .and('include', testdata[15].Value); // Assert that src includes the logo path
        cy.get('.print-format-container', { timeout: 10000 })
          .its('0.contentDocument.body', { timeout: 10000 })
          .find('img') // Re-select the logo image
          .then(($img) => {
            const position = $img[0].getBoundingClientRect();
            expect(position.top).to.be.closeTo(0, 50); // Top position should be near 0
            expect(position.right).to.be.closeTo(window.innerWidth, 800);
          })
        })
      })
     
    it('Should have SGB RGB company details in top left', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[13].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap the body for Cypress commands
        .find('.col-xs-4.column-break') // Locate the target element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get element's position
          
          // Assert the top-left position
          expect(position.top).to.be.closeTo(0, 50); // Top position near 0
          expect(position.left).to.be.closeTo(0, 60); // Left position near 0
        });

      })
    })
    it('Should have correct SGB RGB company address', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[13].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[16].Value)
        .and('contain', testdata[17].Value)
        .and('contain', testdata[18].Value)
        .and('contain', testdata[19].Value)
        .and('contain', testdata[20].Value)
        .and('contain', testdata[23].Value)

      })
    })
    
  })
    describe('SGB RGB Footer', () => {
      it('Should footer be at bottom center', () => {
        cy.get('@testdata').then((testdata) => {
          const target = testdata[13].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap iframe body
        .find('#footer-sgbcz') // Target the footer element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get the element's position
          const parentWidth = $el[0].offsetParent.clientWidth; // Get the width of the parent container
          // Assert it's near the bottom of the iframe
          expect(position.bottom).to.be.closeTo(window.innerHeight, 2500); // Footer close to the bottom
          // Assert it's horizontally centered
          expect(position.left + position.width / 2).to.be.closeTo(parentWidth / 2, 10); // Centered horizontally
        });

      })

      })
      it('Should have correct SGB RGB management director and address at the footer', () => {
        cy.get('@testdata').then((testdata) => {
        const target = testdata[13].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[18].Value)
        .and('contain', testdata[22].Value)
        .and('contain', testdata[21].Value)
      })

      })
    })
  describe('SGB NEU Letter Head', () => {
    it('Should have SGB NEU in the letter head filter', () => {
      cy.get('@testdata').then((testdata) => {
      const target = testdata[24].Value;
      cy.visit(target); 
      cy.wait(3000);
      cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
          .select(testdata[3].Value) 
          .should('have.value', testdata[3].Value);
      cy.wait(3000)
      cy.get('.awesomplete > .input-with-feedback').should('have.value', testdata[25].Value)
    })
    })
    it('Should have the SGB NEU logo at top right corner', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[24].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
          .should('be.visible')
          .find('img') // Find the image inside the body
          .should('have.attr', 'src') // Assert that it has a src attribute
          .and('include', testdata[26].Value); // Assert that src includes the logo path
        cy.get('.print-format-container', { timeout: 10000 })
          .its('0.contentDocument.body', { timeout: 10000 })
          .find('img') // Re-select the logo image
          .then(($img) => {
            const position = $img[0].getBoundingClientRect();
            expect(position.top).to.be.closeTo(0, 50); // Top position should be near 0
            expect(position.right).to.be.closeTo(window.innerWidth, 800);
          })
        })
      })
     
    it('Should have SGB NEU company details in top left', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[24].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap the body for Cypress commands
        .find('.col-xs-4.column-break') // Locate the target element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get element's position
          
          // Assert the top-left position
          expect(position.top).to.be.closeTo(0, 50); // Top position near 0
          expect(position.left).to.be.closeTo(0, 60); // Left position near 0
        });

      })
    })
    it('Should have correct SGB NEU company address', () => {
      cy.get('@testdata').then((testdata) => {
        const target = testdata[24].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[19].Value)
        .and('contain', testdata[23].Value)
        .and('contain', testdata[27].Value)
        .and('contain', testdata[28].Value)
        .and('contain', testdata[29].Value)
        .and('contain', testdata[30].Value)
        .and('contain', testdata[31].Value)
        .and('contain', testdata[32].Value)

      })
    })
    
  })
    describe('SGB NEU Footer', () => {
      it('Should footer be at bottom center', () => {
        cy.get('@testdata').then((testdata) => {
          const target = testdata[24].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .then(cy.wrap) // Wrap iframe body
        .find('#footer-sgbcz') // Target the footer element
        .should('be.visible') // Ensure it is visible
        .then(($el) => {
          const position = $el[0].getBoundingClientRect(); // Get the element's position
          const parentWidth = $el[0].offsetParent.clientWidth; // Get the width of the parent container
          // Assert it's near the bottom of the iframe
          expect(position.bottom).to.be.closeTo(window.innerHeight, 2500); // Footer close to the bottom
          // Assert it's horizontally centered
          expect(position.left + position.width / 2).to.be.closeTo(parentWidth / 2, 10); // Centered horizontally
        });

      })

      })
      it('Should have correct SGB NEU management director and address at the footer', () => {
        cy.get('@testdata').then((testdata) => {
        const target = testdata[24].Value;
        cy.visit(target); 
        cy.wait(3000);
        cy.get('div[data-fieldname="print_format"] select', { timeout: 10000 }) 
            .select(testdata[3].Value) 
            .should('have.value', testdata[3].Value);
        cy.wait(3000)
        cy.get('.print-format-container',{timeout:10000}).its('0.contentDocument.body',{timeout:10000})
        .should('not.be.empty') // Ensure the iframe body is loaded
        .and('contain', testdata[33].Value)
        .and('contain', testdata[34].Value)
        .and('contain', testdata[31].Value)
        .and('contain', testdata[32].Value)
      })

      })
    })
  
    });

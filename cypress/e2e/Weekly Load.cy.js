
describe('SGBCZ Weekly Load', () => {
  beforeEach(() => {
  // Read data from the Excel file
        cy.task('readExcelFile', { filePath: 'cypress/e2e/variables/envWeekly LoadEU000010500028.xlsx', sheetName: 'Sheet1' }).then((data) => {
        Cypress.log({message:'excel data loaded',log:false});
        cy.wrap(data, {log:false}).as('testdata');
    });
});
it('Sales Table', () => {
  cy.get('@testdata').then((testdata) => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const url = testdata[0].value
  const path = testdata[1].value
  const w1 = testdata[2].value
  const w2 = testdata[3].value
  const w3 = testdata[4].value
  const w4 = testdata[5].value
  const w5 = testdata[6].value
  const w6 = testdata[7].value
  const w7 = testdata[8].value
  const w8 = testdata[9].value
  const w9 = testdata[10].value
  const w10 = testdata[11].value
  const w11 = testdata[12].value
  const w12 = testdata[13].value
  const w13 = testdata[14].value
  const w14 = testdata[15].value
  const w15 = testdata[16].value
  const w16 = testdata[17].value
  const w17 = testdata[18].value
  const w18 = testdata[19].value
  const w19 = testdata[20].value
  const w20 = testdata[21].value
  const w21 = testdata[22].value
  const w22 = testdata[23].value
  const w23 = testdata[24].value
  const w24 = testdata[25].value
  const w25 = testdata[26].value
  const w26 = testdata[27].value
  const w27 = testdata[28].value
  const w28 = testdata[29].value
  const w29 = testdata[30].value
  const w30 = testdata[31].value
  const w31 = testdata[32].value
  const w32 = testdata[33].value
  const w33 = testdata[34].value
  const w34 = testdata[35].value
  const w35 = testdata[36].value
  const w36 = testdata[37].value
  const w37 = testdata[38].value
  const w38 = testdata[39].value
  const w39 = testdata[40].value
  const w40 = testdata[41].value
  const w41 = testdata[42].value
  const w42 = testdata[43].value
  const w43 = testdata[44].value
  const w44 = testdata[45].value
  const w45 = testdata[46].value
  const w46 = testdata[47].value
  const w47 = testdata[48].value
  const w48 = testdata[49].value
  const w49 = testdata[50].value
  const w50 = testdata[51].value
  const w51 = testdata[52].value
  const w52 = testdata[53].value
  const p1 = testdata[54].value
  const p2 = testdata[55].value
  const p3 = testdata[56].value
  const p4 = testdata[57].value
  const p5 = testdata[58].value
  const p6 = testdata[59].value
  const p7 = testdata[60].value
  const p8 = testdata[61].value
  const p9 = testdata[61].value
  const p10 = testdata[62].value
  const p11 = testdata[63].value
  const p12 = testdata[64].value
  const p13 = testdata[65].value
  const p14 = testdata[66].value
  const p15 = testdata[67].value
  const p16 = testdata[68].value
  const p17 = testdata[69].value
  const p18 = testdata[70].value
  const p19 = testdata[71].value
  const p20 = testdata[72].value
  const p21 = testdata[73].value
  const p22 = testdata[74].value
  const p23 = testdata[75].value
  const p24 = testdata[76].value
  const p25 = testdata[77].value
  const p26 = testdata[79].value
  const p27 = testdata[80].value
  const p28 = testdata[81].value
  const p29 = testdata[82].value
  const p30 = testdata[83].value
  const p31 = testdata[84].value
  const p32 = testdata[85].value
  const p33 = testdata[86].value
  const p34 = testdata[87].value
  const p35 = testdata[88].value
  const p36 = testdata[89].value
  const p37 = testdata[90].value
  const p38 = testdata[91].value
  const p39 = testdata[92].value
  const p40 = testdata[93].value
  const p41 = testdata[94].value
  const p42 = testdata[95].value
  const p43 = testdata[96].value
  const p44 = testdata[97].value
  const p45 = testdata[98].value
  const p46 = testdata[99].value
  const p47 = testdata[100].value
  const p48 = testdata[101].value
  const p49 = testdata[102].value
  const p50 = testdata[103].value
  const p51 = testdata[104].value
  const p52 = testdata[105].value
 


  // Sequence 1: Login and navigate to new quotation 
  
  cy.visit(url);
   
  // Typing into inputs
  cy.get('#login_email').type(username);
  cy.get('#login_password').type(password);
   
  // Clicking the login button and waiting for navigation
  cy.get('.for-login > .login-content > .form-signin > .page-card-actions > .btn').click({force: true});
  cy.location('pathname', { timeout: 10000 }).should('include', '/app');
  cy.visit(path).wait(1000);
  cy.get('.dt-row-2 > .dt-cell--col-3 > .dt-cell__content > div').should('contain', w1);
  cy.get('.dt-row-2 > .dt-cell--col-4 > .dt-cell__content > div').should('contain', w2);
  cy.get('.dt-row-2 > .dt-cell--col-5 > .dt-cell__content > div').should('contain', w3);
  cy.get('.dt-row-2 > .dt-cell--col-6 > .dt-cell__content > div').should('contain', w4);
  cy.get('.dt-row-2 > .dt-cell--col-7 > .dt-cell__content > div').should('contain', w5);
  cy.get('.dt-row-2 > .dt-cell--col-8 > .dt-cell__content > div').should('contain', w6);
  cy.get('.dt-row-2 > .dt-cell--col-9 > .dt-cell__content > div').should('contain', w7);
  cy.get('.dt-row-2 > .dt-cell--col-10 > .dt-cell__content > div').should('contain', w8);
  cy.get('.dt-row-2 > .dt-cell--col-11 > .dt-cell__content > div').should('contain', w9);
  cy.get('.dt-row-2 > .dt-cell--col-12 > .dt-cell__content > div').should('contain', w10);
  cy.get('.dt-row-2 > .dt-cell--col-13 > .dt-cell__content > div').should('contain', w11);
  cy.get('.dt-row-2 > .dt-cell--col-14 > .dt-cell__content > div').should('contain', w12);
  cy.get('.dt-row-2 > .dt-cell--col-15 > .dt-cell__content > div').should('contain', w13);
  cy.get('.dt-row-2 > .dt-cell--col-16 > .dt-cell__content > div').should('contain', w14);
  cy.get('.dt-row-2 > .dt-cell--col-17 > .dt-cell__content > div').should('contain', w15);
  cy.get('.dt-row-2 > .dt-cell--col-18 > .dt-cell__content > div').should('contain', w16);
  cy.get('.dt-row-2 > .dt-cell--col-19 > .dt-cell__content > div').should('contain', w17);
  cy.get('.dt-row-2 > .dt-cell--col-20 > .dt-cell__content > div').should('contain', w18);
  cy.get('.dt-row-2 > .dt-cell--col-21 > .dt-cell__content > div').should('contain', w19);
  cy.get('.dt-row-2 > .dt-cell--col-22 > .dt-cell__content > div').should('contain', w20);
  cy.get('.dt-row-2 > .dt-cell--col-23 > .dt-cell__content > div').should('contain', w21);
  cy.get('.dt-row-2 > .dt-cell--col-24 > .dt-cell__content > div').should('contain', w22);
  cy.get('.dt-row-2 > .dt-cell--col-25 > .dt-cell__content > div').should('contain', w23);
  cy.get('.dt-row-2 > .dt-cell--col-26 > .dt-cell__content > div').should('contain', w24);
  cy.get('.dt-row-2 > .dt-cell--col-27 > .dt-cell__content > div').should('contain', w25);
  cy.get('.dt-row-2 > .dt-cell--col-28 > .dt-cell__content > div').should('contain', w26);
  cy.get('.dt-row-2 > .dt-cell--col-29 > .dt-cell__content > div').should('contain', w27);
  cy.get('.dt-row-2 > .dt-cell--col-30 > .dt-cell__content > div').should('contain', w28);
  cy.get('.dt-row-2 > .dt-cell--col-31 > .dt-cell__content > div').should('contain', w29);
  cy.get('.dt-row-2 > .dt-cell--col-32 > .dt-cell__content > div').should('contain', w30);
  cy.get('.dt-row-2 > .dt-cell--col-33 > .dt-cell__content > div').should('contain', w31);
  cy.get('.dt-row-2 > .dt-cell--col-34 > .dt-cell__content > div').should('contain', w32);
  cy.get('.dt-row-2 > .dt-cell--col-35 > .dt-cell__content > div').should('contain', w33);
  cy.get('.dt-row-2 > .dt-cell--col-36 > .dt-cell__content > div').should('contain', w34);
  cy.get('.dt-row-2 > .dt-cell--col-37 > .dt-cell__content > div').should('contain', w35);
  cy.get('.dt-row-2 > .dt-cell--col-38 > .dt-cell__content > div').should('contain', w36);
  cy.get('.dt-row-2 > .dt-cell--col-39 > .dt-cell__content > div').should('contain', w37);
  cy.get('.dt-row-2 > .dt-cell--col-40 > .dt-cell__content > div').should('contain', w38);
  cy.get('.dt-row-2 > .dt-cell--col-41 > .dt-cell__content > div').should('contain', w39);
  cy.get('.dt-row-2 > .dt-cell--col-42 > .dt-cell__content > div').should('contain', w40);
  cy.get('.dt-row-2 > .dt-cell--col-43 > .dt-cell__content > div').should('contain', w41);
  cy.get('.dt-row-2 > .dt-cell--col-44 > .dt-cell__content > div').should('contain', w42);
  cy.get('.dt-row-2 > .dt-cell--col-45 > .dt-cell__content > div').should('contain', w43);
  cy.get('.dt-row-2 > .dt-cell--col-46 > .dt-cell__content > div').should('contain', w44);
  cy.get('.dt-row-2 > .dt-cell--col-48 > .dt-cell__content > .bg-danger > div').should('contain', w45).should('have.css', 'color', 'rgb(255, 255, 255)');
  cy.get('.dt-row-2 > .dt-cell--col-49 > .dt-cell__content > div').should('contain', w46);
  cy.get('.dt-row-2 > .dt-cell--col-50 > .dt-cell__content > div').should('contain', w47);
  cy.get('.dt-row-2 > .dt-cell--col-51 > .dt-cell__content > .bg-danger > div').should('contain', w48).should('have.css', 'color', 'rgb(255, 255, 255)');
  cy.get('.dt-row-2 > .dt-cell--col-52 > .dt-cell__content > div').should('contain', w49);
  cy.get('.dt-row-2 > .dt-cell--col-53 > .dt-cell__content > div').should('contain', w50);
  cy.get('.dt-row-2 > .dt-cell--col-54 > .dt-cell__content > .bg-danger > div').should('contain', w51).should('have.css', 'color', 'rgb(255, 255, 255)');
  cy.get('.dt-row-2 > .dt-cell--col-55 > .dt-cell__content > .bg-danger > div').should('contain', w52).should('have.css', 'color', 'rgb(255, 255, 255)');
   //Parallel Coil
      cy.get('.dt-row-19 > .dt-cell--col-4 > .dt-cell__content > div').should('contain', p1);
      cy.get('.dt-row-19 > .dt-cell--col-5 > .dt-cell__content > div').should('contain', p2);
      cy.get('.dt-row-19 > .dt-cell--col-6 > .dt-cell__content > div').should('contain', p3);
      cy.get('.dt-row-19 > .dt-cell--col-7 > .dt-cell__content > div').should('contain', p4);
      cy.get('.dt-row-19 > .dt-cell--col-8 > .dt-cell__content > div').should('contain', p5);
      cy.get('.dt-row-19 > .dt-cell--col-9 > .dt-cell__content > div').should('contain', p6);
      cy.get('.dt-row-19 > .dt-cell--col-10 > .dt-cell__content > div').should('contain', p7);
      cy.get('.dt-row-19 > .dt-cell--col-11 > .dt-cell__content > div').should('contain', p8);
      cy.get('.dt-row-19 > .dt-cell--col-12 > .dt-cell__content > div').should('contain', p9);
      cy.get('.dt-row-19 > .dt-cell--col-13 > .dt-cell__content > div').should('contain', p10);
      cy.get('.dt-row-19 > .dt-cell--col-14 > .dt-cell__content > div').should('contain', p11);
      cy.get('.dt-row-19 > .dt-cell--col-15 > .dt-cell__content > div').should('contain', p12);
      cy.get('.dt-row-19 > .dt-cell--col-16 > .dt-cell__content > div').should('contain', p13);
      cy.get('.dt-row-19 > .dt-cell--col-17 > .dt-cell__content > div').should('contain', p14);
      cy.get('.dt-row-19 > .dt-cell--col-18 > .dt-cell__content > div').should('contain', p15);
      cy.get('.dt-row-19 > .dt-cell--col-19 > .dt-cell__content > div').should('contain', p16);
      cy.get('.dt-row-19 > .dt-cell--col-20 > .dt-cell__content > div').should('contain', p17);
      cy.get('.dt-row-19 > .dt-cell--col-21 > .dt-cell__content > div').should('contain', p18);
      cy.get('.dt-row-19 > .dt-cell--col-22 > .dt-cell__content > div').should('contain', p19);
      cy.get('.dt-row-19 > .dt-cell--col-23 > .dt-cell__content > div').should('contain', p20);
      cy.get('.dt-row-19 > .dt-cell--col-24 > .dt-cell__content > div').should('contain', p21);
      cy.get('.dt-row-19 > .dt-cell--col-25 > .dt-cell__content > div').should('contain', p22);
      cy.get('.dt-row-19 > .dt-cell--col-26 > .dt-cell__content > div').should('contain', p23);
      cy.get('.dt-row-19 > .dt-cell--col-27 > .dt-cell__content > div').should('contain', p24);
      cy.get('.dt-row-19 > .dt-cell--col-28 > .dt-cell__content > div').should('contain', p25);
      cy.get('.dt-row-19 > .dt-cell--col-29 > .dt-cell__content > div').should('contain', p26);
      cy.get('.dt-row-19 > .dt-cell--col-30 > .dt-cell__content > div').should('contain', p27);
      cy.get('.dt-row-19 > .dt-cell--col-31 > .dt-cell__content > div').should('contain', p28);
      cy.get('.dt-row-19 > .dt-cell--col-32 > .dt-cell__content > div').should('contain', p29);
      cy.get('.dt-row-19 > .dt-cell--col-33 > .dt-cell__content > div').should('contain', p30);
      cy.get('.dt-row-19 > .dt-cell--col-34 > .dt-cell__content > div').should('contain', p31);
      cy.get('.dt-row-19 > .dt-cell--col-35 > .dt-cell__content > div').should('contain', p32);
      cy.get('.dt-row-19 > .dt-cell--col-36 > .dt-cell__content > div').should('contain', p33);
      cy.get('.dt-row-19 > .dt-cell--col-37 > .dt-cell__content > div').should('contain', p34);
      cy.get('.dt-row-19 > .dt-cell--col-38 > .dt-cell__content > div').should('contain', p35);
      cy.get('.dt-row-19 > .dt-cell--col-39 > .dt-cell__content > div').should('contain', p36);
      cy.get('.dt-row-19 > .dt-cell--col-40 > .dt-cell__content > div').should('contain', p37);
      cy.get('.dt-row-19 > .dt-cell--col-41 > .dt-cell__content > div').should('contain', p38);
      cy.get('.dt-row-19 > .dt-cell--col-42 > .dt-cell__content > div').should('contain', p39);
      cy.get('.dt-row-19 > .dt-cell--col-43 > .dt-cell__content > div').should('contain', p40);
      cy.get('.dt-row-19 > .dt-cell--col-44 > .dt-cell__content > div').should('contain', p41);
      cy.get('.dt-row-19 > .dt-cell--col-45 > .dt-cell__content > .bg-danger > div').should('contain', p42).should('have.css', 'color', 'rgb(255, 255, 255)');
      cy.get('.dt-row-19 > .dt-cell--col-46 > .dt-cell__content > div').should('contain', p43);
      cy.get('.dt-row-19 > .dt-cell--col-47 > .dt-cell__content > div').should('contain', p44);
      cy.get('.dt-row-19 > .dt-cell--col-48 > .dt-cell__content > div').should('contain', p45);
      cy.get('.dt-row-19 > .dt-cell--col-49 > .dt-cell__content > div').should('contain', p46);
      cy.get('.dt-row-19 > .dt-cell--col-50 > .dt-cell__content > div').should('contain', p47).should('have.css', 'color', 'rgb(255, 255, 255)');
      cy.get('.dt-row-19 > .dt-cell--col-51 > .dt-cell__content > div').should('contain', p48);
      cy.get('.dt-row-19 > .dt-cell--col-52 > .dt-cell__content > div').should('contain', p49);
      cy.get('.dt-row-19 > .dt-cell--col-53 > .dt-cell__content > .bg-danger > div').should('contain', p50).should('have.css', 'color', 'rgb(255, 255, 255)');
      cy.get('.dt-row-19 > .dt-cell--col-54 > .dt-cell__content > .bg-danger > div').should('contain', p51).should('have.css', 'color', 'rgb(255, 255, 255)');
      cy.get('.dt-row-19 > .dt-cell--col-55 > .dt-cell__content > .bg-danger > div').should('contain', p52).should('have.css', 'color', 'rgb(255, 255, 255)');



      });
});
});
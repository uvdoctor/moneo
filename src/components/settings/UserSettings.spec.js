describe("User Settings", () => {
  it("loads successfully", () => {
    cy.visit("https://moneo.in/settings");

    //Login
    cy.get("input#emailChange_email").type("mehzabeen1526@gmail.com").wait(2000);
    cy.get("button#login").click().wait(5000);
    cy.get("input#form_password").type("Mehz@1234").wait(5000);
    cy.get("button#login").click().wait(5000);


    cy.get(".ant-page-header-heading-title")
      .should("be.visible")
      .should("contain.text", "Settings");

    // Personal Tab
    cy.get('input[placeholder="Name"]').clear().type("Mehz").wait(1000);
    cy.get('input[placeholder="Last Name"]').clear().type("Choudhari").wait(1000);
    cy.get('input[placeholder="Select date"]').click()
    cy.get('td.ant-picker-cell.ant-picker-cell-start.ant-picker-cell-in-view').click()
    cy.get("button#save").click().wait(5000);
    cy.reload().wait(2000);

    // cy.get('input[placeholder="Name"]').should("have.value", "Mehz");
    // cy.get('input[placeholder="Last Name"]').should("have.value", "Choudhari");
    // cy.get('input[placeholder="Select date"]').should("have.value", "01-Apr-2000");


    // Profile Tab
    // cy.get('.ant-tabs-tab').find('div.active').next().click()
    // cy.get('#rc-tabs-0-panel-2 > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div').click()




   
  });
});

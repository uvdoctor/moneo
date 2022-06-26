describe("Without Login - Search", () => {
  it("Visit Home Page", () => {
    cy.visit("https://moneo.in");
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");
    // cy.intercept("GET", "https://moneo.in/api/tradingview/config");
    // cy.intercept("GET", "https://moneo.in/api/tradingview/symbols?symbol=GAIL");
  });

  it("should show favourites and search dropdown of Stocks - INDIA", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");
    cy.intercept(
      "POST",
      "https://2x5orxpn4vgtdmtheb3q6h5tuu.appsync-api.us-east-1.amazonaws.com/graphql",
      (req) => {
        req.reply((res) => {
          res.send({
            statusCode: 200,
          });
        });
      }
    ).as("graphlCall");

    cy.get('input[placeholder="Search Stocks"]')
      .click()
      .type("GAIL")
      .wait(5000);
    cy.wait("@graphlCall").its("response.statusCode").should("eq", 200);
    cy.get(".rc-virtual-list").should("be.visible").wait(2000);
    cy.get('input[placeholder="Search Stocks"]').clear().click().wait(2000);
    cy.get(".rc-virtual-list-holder-inner").children().should("have.length", 5);
  });

  it("should go to lookup page on selection", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");
    cy.intercept("GET", "https://moneo.in/api/details?name=GAIL.NSE", (req) => {
      req.reply((res) => {
        res.send({
          statusCode: 200,
        });
      });
    }).as("lookup");

    cy.get('input[placeholder="Search Stocks"]').click().type("GAIL");
    cy.get(".rc-virtual-list").should("be.visible");
    cy.contains(".ant-select-item-option-content", "GAIL (India) Limited")
      .click()
      .wait(7000);
    cy.wait("@lookup").its("response.statusCode").should("eq", 200);
    cy.get(".ant-page-header-heading-title")
      .should("be.visible")
      .should("contain.text", "GAIL")
      .should("contain.text", "₹");
    cy.get(".ant-rate").should("be.visible");
  });

  it("should show US Stocks", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");

    cy.get('input[placeholder="Search Stocks"]').click();
    cy.contains(".ant-select-selection-item", "INDIA").click().wait(1000);
    cy.contains(".ant-select-item-option-content", "US").click().wait(3000);
    cy.get('input[placeholder="Search Stocks"]').click().wait(1000);
    cy.get(".rc-virtual-list").should("be.visible");
    cy.get(".rc-virtual-list-holder-inner")
      .first()
      .children()
      .should("have.length", 5);
    cy.get('input[placeholder="Search Stocks"]')
      .click()
      .type("Apple")
      .wait(5000);
    cy.contains(".ant-select-item-option-content", "Apple Inc")
      .should("be.visible")
      .wait(3000);
  });

  it("should show Mutual Funds(US) on click", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");

    cy.get('input[placeholder="Search Stocks"]').click();
    cy.contains(".ant-select-selection-item", "STOCK").click().wait(1000);
    cy.contains(".ant-select-item-option-content", "MF").click().wait(5000);
    cy.get('input[placeholder="Search Mutual Funds"]').click().wait(1000);
    cy.get(".rc-virtual-list").should("be.visible");
    cy.get(".rc-virtual-list-holder-inner")
      .first()
      .children()
      .should("have.length", 5);
  });

  it("should show Mutual Funds(India) on click", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");

    cy.contains(".ant-select-selection-item", "US").click().wait(1000);
    cy.contains(".ant-select-item-option-content", "INDIA").click().wait(3000);
    cy.get('input[placeholder="Search Mutual Funds"]')
      .click()
      .type("ICICI")
      .wait(5000);
    cy.get(".rc-virtual-list").should("be.visible");
  });

  it("should show ETFs(India) on click", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");

    cy.get('input[placeholder="Search Mutual Funds"]').clear().click();
    cy.contains(".ant-select-selection-item", "MF").click().wait(1000);
    cy.contains(".ant-select-item-option-content", "ETF").click().wait(5000);
    cy.get('input[placeholder="Search ETFs"]').click().wait(1000);
    cy.get(".rc-virtual-list").should("be.visible");
    cy.get(".rc-virtual-list-holder-inner")
      .first()
      .children()
      .should("have.length", 5);
  });

  it("should show ETFs(US) on click", () => {
    cy.intercept("POST", "https://moneo.in/api/verifycaptcha");

    cy.get('input[placeholder="Search ETFs"]').clear().click();
    cy.contains(".ant-select-selection-item", "INDIA").click().wait(1000);
    cy.contains(".ant-select-item-option-content", "US").click().wait(3000);
    cy.get('input[placeholder="Search ETFs"]').click().wait(1000);
    cy.get(".rc-virtual-list").should("be.visible");
    cy.get(".rc-virtual-list-holder-inner")
      .first()
      .children()
      .should("have.length", 5);
    cy.get('input[placeholder="Search ETFs"]').click().type("etf").wait(5000);
  });
});

// describe("With Login - Moneo Overview Page", () => {
//   it("Login", () => {
//     cy.intercept("POST", "https://moneo.in/api/verifycaptcha");
//     cy.visit("https://moneo.in/get");
//     cy.get("input#emailChange_email")
//       .type("mehzabeen1526@gmail.com")
//       .wait(5000);
//     cy.get("button#login").click().wait(10000);
//     cy.get("input#form_password").type("Mehz@123").wait(5000);
//     cy.get("button#login").click().wait(10000);
//   });

//   it("Search With Stock", () => {
//     cy.get('input[placeholder="Search Stocks"]').click();
//     cy.get(".rc-virtual-list").should("be.visible");
//     cy.get(".rc-virtual-list-holder-inner").children().should("have.length", 5);
//     cy.get('input[placeholder="Search Stocks"]').click().type("GAIL");
//     cy.intercept("GET", "https://moneo.in/api/details?name=GAIL.NSE", (req) => {
//       req.reply((res) => {
//         res.send({
//           statusCode: 200,
//         });
//       });
//     }).as("lookup");
//     cy.contains(".ant-select-item-option-content", "GAIL (India) Limited")
//       .click()
//       .wait(3000);
//     cy.wait("@lookup").its("response.statusCode").should("eq", 200);
//   });

//   it("Check Qunatity, Rating and Title on Lookup Page", () => {
//     cy.wait(3000);
//     cy.get(".ant-page-header-heading-title")
//       .should("be.visible")
//       .should("contain.text", "GAIL")
//       .should("contain.text", "₹");
//     cy.get(".ant-rate").should("be.visible");
//     cy.get(".anticon-shopping-cart")
//       .should("be.visible")
//       .should("contain.text", "35");
//   });
// });

describe("Without Login - Search", () => {
  it("Visit Home Page", () => {
    cy.visit("https://moneo.in");
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
    cy.intercept("GET", "https://moneo.in/api/details?name=GAIL.NSE", (req) => {
      req.reply((res) => {
        res.send({
          statusCode: 200,
        });
      });
    }).as("lookup");
    cy.intercept("GET", "https://moneo.in/api/tradingview/config");
    cy.intercept("GET", "https://moneo.in/api/tradingview/symbols?symbol=GAIL");

    cy.get('input[placeholder="Search Stocks"]').click().type("GAIL");
    cy.wait("@graphlCall").its("response.statusCode").should("eq", 200);
    cy.get(".rc-virtual-list").should("be.visible");
    cy.get('input[placeholder="Search Stocks"]').clear().click();
    cy.get(".rc-virtual-list-holder-inner").children().should("have.length", 5);
    cy.get('input[placeholder="Search Stocks"]').click().type("GAIL");
    cy.contains(".ant-select-item-option-content", "GAIL (India) Limited")
      .click()
      .wait(7000);
    cy.wait("@lookup").its("response.statusCode").should("eq", 200);
    cy.get(".ant-page-header-heading-title")
      .should("be.visible")
      .should("contain.text", "GAIL")
      .should("contain.text", "₹");
    cy.get(".ant-rate").should("be.visible");

    cy.get('input[placeholder="Search Stocks"]').click();
    cy.contains('.ant-select-selection-item', "STOCK").click()
    cy.contains(".ant-select-item-option-content", "MF")
    .click()
    .wait(1000);
    cy.get('input[placeholder="Search MF"]').click();
    cy.get(".rc-virtual-list-holder-inner").children().should("have.length", 5);

    // cy.get('input[placeholder="Search MF"]').click();
    // cy.get('.ant-select-dropdown .ant-select-dropdown-placement-bottomLeft .ant-select-dropdown-hidden').click()
    // cy.contains(".ant-select-item-option-content", "ETF")
    // .click()
    // .wait(1000);
    // cy.get('input[placeholder="Search ETF"]').click();
    // cy.get(".rc-virtual-list-holder-inner").children().should("have.length", 5);
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
//       .wait(7000);
//     cy.wait("@lookup").its("response.statusCode").should("eq", 200);
//   });

//   it("Check Qunatity, Rating and Title on Lookup Page", () => {
//     cy.get(".ant-page-header-heading-title")
//       .should("be.visible")
//       .should("contain.text", "GAIL")
//       .should("contain.text", "₹");
//     cy.get(".ant-rate").should("be.visible");
//     cy.get(".anticon-shopping-cart")
//       .should("be.visible")
//       .should("contain.text", "35");

//     // anticon anticon-shopping-cart
//     // cy.get("#rc-tabs-0-tab-highlights").click();
//     // cy.get('.rc-virtual-list-holder-inner:first').click()
//     // cy.get('.ant-select-item-option-content').click()

//     // cy.get(".ant-page-header-heading-title")
//     //   .should("be.visible")
//     //   .should("contain.text", "Settings");

//     // Personal Tab
//     // cy.get('input[placeholder="Name"]').clear().type("Mehzabeen").wait(1000);
//     // cy.get('input[placeholder="Last Name"]')
//     //   .clear()
//     //   .type("Choudhari")
//     //   .wait(1000);
//     // cy.get('input[placeholder="Select date"]').click();
//     // cy.get(
//     //   "td.ant-picker-cell.ant-picker-cell-start.ant-picker-cell-in-view"
//     // ).click();

//     // cy.intercept("POST", "https://2x5orxpn4vgtdmtheb3q6h5tuu.appsync-api.us-east-1.amazonaws.com/graphql", (req) => {
//     //     req.reply((res) => {
//     //       res.send({
//     //         statusCode: 200,
//     //         // body: {
//     //         //   data: {
//     //         //     updateUserInfo: {},
//     //         //   },
//     //         // },
//     //       });
//     //     });
//     //   }
//     // ).as("save");

//     // cy.intercept("POST", "https://cognito-idp.us-east-1.amazonaws.com/");
//     // cy.get("button#save").click().wait(2000);
//     // cy.wait("@save").its("response.statusCode").should("eq", 200);
//     // cy.reload().wait(2000);

//     // cy.get('input[placeholder="Name"]').should("have.value", "Mehz");
//     // cy.get('input[placeholder="Last Name"]').should("have.value", "Choudhari");
//     // cy.get('input[placeholder="Select date"]').should("have.value", "01-Apr-2000");

//     // Profile Tab
//     // cy.get('.ant-tabs-tab').find('div.active').next().click()
//     // cy.get('#rc-tabs-0-panel-2 > div > div.ant-col.ant-col-24 > div > div:nth-child(1) > div > div > div:nth-child(1) > div > div').click()
//   });
// });

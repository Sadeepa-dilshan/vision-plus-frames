// cypress/e2e/login.cy.js

describe("Login component", () => {
    beforeEach(() => {
        cy.login(); // Call the custom login command
        cy.visit("/brands/new");
    });

    it("renders form with input fields and submit button", () => {
        cy.get("[name=brand_name]").should("be.visible");
        cy.get("[name=brand_price]").should("be.visible");
        cy.get("[data-test=brand-submit-button]").should("be.visible");
        cy.get("[name=brand_name]").type("Test Branc");
        cy.get("[name=brand_price]").type("10.10");
        cy.get("[data-test=brand-submit-button]").click();
        // cy.visit("/brands/new");
    });
});

// cypress/e2e/login.cy.js

describe("Login component", () => {
    beforeEach(() => {
        cy.login(); // Call the custom login command
        cy.visit("/frames/new");
    });

    it("receives data from useFrameList hook", () => {});
});

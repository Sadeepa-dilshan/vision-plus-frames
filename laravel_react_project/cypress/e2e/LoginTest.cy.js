describe("Authenticated pages", () => {
    beforeEach(() => {
        cy.login(); // Call the custom login command
    });

    it("visits the brands page as a logged-in user", () => {
        cy.visit("/brands/new");
        cy.url().should("include", "/brands/new");
    });
});

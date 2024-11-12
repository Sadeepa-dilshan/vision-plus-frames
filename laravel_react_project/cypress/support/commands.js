// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })// In cypress/support/commands.js
Cypress.Commands.add("login", () => {
    cy.request({
        method: "POST",
        url: "https://www.visionplusframes.com/public/api/login",
        body: {
            email: "Visionplus@gmail.com",
            password: "vision@1234",
        },
    }).then((response) => {
        const token = response.body.token;
        cy.window().then((window) => {
            window.localStorage.setItem("ACCESS_TOKEN", token);
        });
    });
});

describe("Document Page", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[type="email"').type("user@example.com");
    cy.get('input[type="password"]').type("password");
    cy.get("button").contains("Login").click();

    cy.visit("/document/test-id");
  });

  it("should load and display the document", () => {
    cy.get(".ql-editor").should("be.visible");
    cy.contains("Document ID: test-id").should("exist");
  });

  it("should allow editing the document", () => {
    cy.get(".ql-editor").type("Hello, Cypress!");
    cy.contains("Hello, Cypress!").should("exist");
  });

  it("should restore a previous version", () => {
    cy.contains("Restore Version 1").click();
    cy.contains("Version restored").should("be.visible");
  });
});

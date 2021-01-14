describe("Results list page", () => {
  beforeEach(() => {
    cy.visit("/")
    cy.injectAxe()

    cy.intercept(
      {
        pathname: "/services",
      },
      {
        fixture: "services",
      }
    )
  })

  it("has no accessibility problems", () => {
    cy.checkA11y()
  })

  it("renders a list of results", () => {
    cy.visit("/")
    cy.get("h1").should("contain", "Find activities and organisations near you")

    // cy.get("ul li").should("have.length", 20)

    // cy.get("ul")
    //   .should("contain", "12th Aylesbury Brownies")
    //   .should("contain", "Chepping View Primary Academy")
  })
})

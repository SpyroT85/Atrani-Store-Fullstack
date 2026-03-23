describe('Atrani Storefront - Full User Flow', () => {

  it('should login, browse, add to cart and checkout', () => {
    // Visit homepage
    cy.visit('http://localhost:5174');
    cy.wait(1500);

    // Login
    cy.get('[data-cy="user-icon"]').click();
    cy.wait(800);
    cy.get('[data-cy="auth-email"]').type('spy011010@gmail.com', { delay: 80 });
    cy.wait(300);
    cy.get('[data-cy="auth-password"]').type('Spyros1985!', { delay: 80 });
    cy.wait(300);
    cy.get('[data-cy="auth-submit"]').click();
    cy.get('[data-cy="auth-submit"]', { timeout: 10000 }).should('not.exist');
    cy.wait(1000);

    // Navigate directly to product page
    cy.visit('/pens/quill/quill-silver');
    cy.wait(1500);

    // Add to cart
    cy.get('[data-cy="add-to-cart-btn"]', { timeout: 8000 }).click({ force: true });
    cy.wait(1000);

    // Click cart icon to open drawer
    cy.get('[data-cy="cart-icon"]').click({ force: true });
    cy.wait(2000);

    // Click Checkout μέσα στο drawer
    cy.contains('Checkout').click({ force: true });
    cy.wait(1500);

    // Fill billing details
    cy.get('input[placeholder="Mario Rossi"]').type('John Doe', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="example@mail.com"]').type('spy011010@gmail.com', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="+1 202-555-0136"]').type('+30 6900000000', { delay: 60 });
    cy.wait(200);

    // Fill shipping info
    cy.get('input[placeholder="1137 Williams Avenue"]').type('Test Street 1', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="10001"]').type('10000', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="Atrani"]').type('Athens', { delay: 60 });
    cy.wait(200);

    // Select country
    cy.contains('Select a country').click();
    cy.wait(500);
    cy.contains('Greece').click();
    cy.wait(500);

    // Scroll to button and click
    cy.contains('Continue & Pay').scrollIntoView({ duration: 800, block: 'center' });
    cy.wait(500);
    cy.scrollTo(0, -200, { duration: 500 });
    cy.wait(1000);
    cy.contains('Continue & Pay').click();
    cy.wait(5000);
  });

});
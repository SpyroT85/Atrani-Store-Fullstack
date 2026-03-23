describe('Atrani Admin Panel - Add Product', () => {

  it('should login and add a new product', () => {
    // Visit admin panel
    cy.visit('http://localhost:5175');
    cy.wait(1500);

    // Login
    cy.get('input[type="email"]').type('spy011010@gmail.com', { delay: 80 });
    cy.wait(300);
    cy.get('input[type="password"]').type('Spyros1985!', { delay: 80 });
    cy.wait(300);
    cy.get('button[type="submit"]').click();
    cy.wait(2000);

    // Click Add Product button
    cy.contains('Add product').click({ force: true });
    cy.wait(1000);

    // Fill form
    cy.get('input[placeholder="Product name"]').type('Smartwatch Mist', { delay: 60 });
    cy.wait(200);
    cy.get('select').select('watches/smartwatches');
    cy.wait(200);
    cy.get('input[placeholder="0.00"]').type('299', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="AW1001"]').type('SW7004', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="0"]').type('80', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="watches-classic"]').type('smartwatch-mist', { delay: 60 });
    cy.wait(200);

    // Upload image
    cy.get('input[type="file"]').selectFile('cypress/fixtures/smartwatch-mist.jpg', { force: true });
    cy.wait(3000);

    // Description
    cy.get('textarea').type('A sleek smartwatch with premium build quality.', { delay: 40 });
    cy.wait(200);

    // Category specific fields
    cy.get('input[placeholder="7 days"]').type('5 days', { delay: 60 });
    cy.wait(200);
    cy.get('input[placeholder="50m"]').type('100m', { delay: 60 });
    cy.wait(200);

    // Save
    cy.contains('Save').click({ force: true });
    cy.wait(3000);

    // Go to Accounts
    cy.contains('Accounts').click({ force: true });
    cy.wait(1500);

    // Click Invite
    cy.get('[data-cy="invite-btn"]').click({ force: true });
    cy.wait(800);

    // Fill invite form
    cy.get('input[placeholder="admin@atrani.com"]').type('mclovin@atrani.com', { delay: 60 });
    cy.wait(200);
    cy.get('[data-cy="invite-role"]').select('admin');
    cy.wait(500);

    // Send invite
    cy.get('[data-cy="invite-submit"]').click({ force: true });
    cy.wait(5000);
    });

});
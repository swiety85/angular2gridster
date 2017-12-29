describe('Gridster', function () {
    var girdsterConfig = {
        dragHandler: '.panel-heading',
        lanes: 4
    };

    beforeEach(function () {
        cy.viewport(1000, 600);
        cy.visit('http://localhost:4200/');
    });

    it('should make space for dragged item', function () {
        cy
            .get('gridster')
            .moveGridsterItem(0, [1, 0], girdsterConfig);

        cy.get('gridster gridster-item').eq(0)
            .should('to.have.css', 'transform', 'matrix(1, 0, 0, 1, 250, 0)');

        cy.get('gridster gridster-item').eq(1)
            .should('to.have.css', 'transform', 'matrix(1, 0, 0, 1, 250, 500)');

        cy.get('gridster gridster-item').eq(2)
            .should('to.have.css', 'transform', 'matrix(1, 0, 0, 1, 250, 750)');

        cy.get('gridster gridster-item').eq(3)
            .should('to.have.css', 'transform', 'matrix(1, 0, 0, 1, 750, 750)');

        cy.get('gridster gridster-item').eq(4)
            .should('to.have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');
    });




});
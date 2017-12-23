describe('Gridster', function () {
    beforeEach(function () {
        cy.visit('http://localhost:4200/');
    });

    it('should exist', function () {

        // https://on.cypress.io/should
        // https://on.cypress.io/and

        cy.get('gridster').should('exist');
    });

    it('should contain 5 items', function () {
        cy.get('gridster').find('gridster-item').should('have.length', 5);
    });

    it('should drag item', function () {
        cy
            .wait(500)
            .get('gridster-item:eq(0)')
            .find('.panel-heading')
            .trigger('mousedown')
            // .trigger('mousemove', {clientX: 1, clientY: 1})
            .trigger('mousemove', {clientX: 50, clientY: 50})
            .trigger('mousemove', {clientX: 350, clientY: 130})
            .trigger('mousemove', {clientX: 351, clientY: 131})
            .trigger('mouseup')
            .should(function (response) {
                expect(response.parent().parent())
                    .to.have.css('transform', 'matrix(1, 0, 0, 1, 250, 0)');
            });
    });




});
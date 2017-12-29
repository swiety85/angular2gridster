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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * `options` properties:
 * - dragHandler
 * - lanes
 * - moveEventsAmount = 1
 * - widthHeightRatio = 1
 */
Cypress.Commands.add('moveGridsterItem', { prevSubject: 'element'}, function (gridsterSubject, idx, coords, options) {
    var baseClientX,
        baseClientY,
        itemElement = gridsterSubject.find('gridster-item').eq(idx),
        dragElement = getDragSubject(itemElement, options),
        itemWidth = parseInt(gridsterSubject.width()/options.lanes, 10),
        itemHeight = parseInt(itemWidth * (options.widthHeightRatio || 1), 10),
        itemRect = itemElement[0].getBoundingClientRect(),
        gridsterRect = gridsterSubject[0].getBoundingClientRect();

    baseClientX = gridsterRect.left + (coords[0] * itemWidth);
    baseClientY = gridsterRect.top + (coords[1] * itemHeight);

    cy.log(baseClientX, baseClientY);

    cy.wrap(dragElement)
        .trigger('mousedown')
        .trigger('mousemove', {clientX: itemRect.left + 5, clientY: itemRect.top + 5})
        .trigger('mousemove', {clientX: itemRect.left + 10, clientY: itemRect.top + 10})
        .trigger('mousemove', {clientX: baseClientX + (itemWidth/2), clientY: baseClientY + 10})
        .trigger('mouseup');

    return cy.wrap(itemElement);

    function getDragSubject(itemElement, options) {
        return options.dragHandler ? itemElement
            .find(options.dragHandler) : itemElement;
    }
});

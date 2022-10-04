/* eslint-disable indent */
// type definitions for Cypress object "cy"
/// <reference types="cypress" />



// type definitions for custom commands like "createDefaultTodos"
/// <reference types="../support" />

describe('TodoMVC - React', function () {
    // setup these constants to match what TodoMVC does
    let TODO_ITEM_ONE = 'buy some cheese'
    let TODO_ITEM_TWO = 'feed the cat'
    let TODO_ITEM_THREE = 'book a doctors appointment'

    beforeEach(function () {

        cy.visit('/')
    })

    // a very simple example helpful during presentations
    it('adds 2 todos', function () {
        cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
            .type(`${TODO_ITEM_TWO}{enter}`)
            .type(`${TODO_ITEM_THREE}{enter}`)

    })

    it('should focus on the todo input field', function () {
        cy.focused().should('have.class', 'new-todo')

    })

    it('No Todos', function () {
        cy.get('.main').should('not.exist')
        cy.get('.footer').should('not.exist')

    })

    it('New Todos', function () {
        cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
        cy.get('.todo-list li:first-child label').should('contain', TODO_ITEM_ONE)


    })

    it('adds items', function () {
        cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
        cy.get('.new-todo').type(`${TODO_ITEM_TWO}{enter}`)
        cy.get('.new-todo').type(`${TODO_ITEM_THREE}{enter}`)
        cy.get('.todo-list li')
            .should('have.length', 3)


    })

    it('should append new items to the bottom of the list', function () {
        cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
        cy.get('.new-todo').type(`${TODO_ITEM_TWO}{enter}`)
        cy.get('.new-todo').type(`${TODO_ITEM_THREE}{enter}`)
        cy.get('.todo-list li:last-child')
            .should('contain', TODO_ITEM_THREE)


    })

    it('should seed default todos', function () {
        cy.createDefaultTodos()


    })

    it('should create one todo', function () {
        cy.createTodo('Test 1')


    })


    it('should show #main and #footer when items added', function () {
        cy.createTodo('Test 1')
        cy.get('.main').should('exist')
        cy.get('.footer').should('exist')

    })

    it('Mark all as completed', function () {
        cy.createDefaultTodos().as('todos')
        cy.get('ul [type="checkbox"]').check()

        cy.get('@todos').each((el) => {
            cy.wrap(el).should('have.class', 'completed')
        })

    })

    it('should allow me to clear the complete state of all items', function () {
        cy.createDefaultTodos().as('todos')
        cy.get('ul [type="checkbox"]').check()
        cy.get('ul [type="checkbox"]').uncheck()

        cy.get('@todos').each((el) => {
            cy.wrap(el).should('not.have.class', 'completed')
        })

    })

    it('should allow me to edit an item', function () {
        cy.createDefaultTodos()
        cy.get('ul [type="checkbox"]').check()
        cy.get('ul li [type="checkbox"]').eq(1).uncheck()
        cy.get('ul li').eq(1).as('secondEl').find('label').dblclick()
        cy.get('@secondEl').find('.edit').clear().type('Test NEW').type('{enter}')

        cy.get('@secondEl').should('contain', 'Test NEW')
    })

    it('should hide other controls when editing', function () {
        cy.createDefaultTodos()
        cy.get('ul [type="checkbox"]').check()
        cy.get('ul li [type="checkbox"]').eq(1).uncheck()
        cy.get('ul li').eq(1).as('secondEl').find('label').dblclick()


        cy.get('@secondEl').find('[type="checkbox"]').should('not.be.visible')
        cy.get('@secondEl').find('.destroy').should('not.be.visible')
    })

    it('should trim entered text', function () {
        cy.createDefaultTodos()
        cy.get('.new-todo').type(' Test New ').type('{enter}')

        cy.get('.main ul li').should('have.length', 4)
    })

    it('should remove the item if an empty text string was entered', function () {
        cy.createDefaultTodos()
        cy.get('.new-todo').type('  ').type('{enter}')

        cy.get('.main ul li').should('have.length', 3)
    })

    it('should cancel edits on escape', function () {
        cy.createDefaultTodos().as('todos')
        cy.get('@todos').eq(0).as('firstEl').dblclick().type('{esc}')

        cy.get('.main ul li').eq(0).should('contain', TODO_ITEM_ONE)
    })

    it('should cancel edits on escape', function () {

        let ar = ['3', ' ', 'items', ' ', 'left']
        cy.createDefaultTodos()
        cy.get('.todo-count').children().each((el, index) => {
            expect(el.text()).to.include(ar[index])
        })
    })

    it('should cancel edits on escape', function () {

        cy.createDefaultTodos()
        cy.get('.todo-count').children().then((el) => {
            cy.log(el)
            expect(el.eq(0)).to.contain('3')
            expect(el.eq(1)).to.contain(' ')
            expect(el.eq(2)).to.contain('items')
            expect(el.eq(3)).to.contain(' left')

        })
    })

    it('Clear completed button', function () {

        cy.createDefaultTodos()
        cy.get('.main ul li').first().find('[type="checkbox"]').check()

        cy.get('.clear-completed').should('exist')

    })

    it('should remove completed items when clicked', function () {

        cy.createDefaultTodos()
        cy.get('.main ul li').first().as('firstEl').find('[type="checkbox"]').check()

        cy.get('.clear-completed').click()

        cy.get('.main li').should('not.contain', TODO_ITEM_ONE)
    })

    it('should be hidden when there are no items that are completed', function () {

        cy.createDefaultTodos()

        cy.get('.clear-completed').should('not.exist')

    })

    it('should persist its data', function () {

        cy.createDefaultTodos()

        cy.get('.main li').as('list').should('have.length', 3)

        cy.reload()

        cy.get('@list').should('have.length', 3)

    })

    it('should allow me to display active items', function () {

        cy.createDefaultTodos()

        cy.get('.main ul li').first().as('firstEl').find('[type="checkbox"]').check()

        cy.get('footer ul li:nth-of-type(2)').click()

        cy.get('.main li').should('not.contain', TODO_ITEM_ONE)

    })

    it('should respect the back button', function () {

        cy.createDefaultTodos()

        cy.get('.main ul li').first().as('firstEl').find('[type="checkbox"]').check()

        cy.get('footer ul li:nth-of-type(2)').click()

        cy.get('footer ul li:nth-of-type(3)').click()

        cy.go('back')
        cy.get('.main li').should('have.length', 2)
        cy.go('back')
        cy.get('.main li').should('have.length', 3)
    })

    it('should allow me to display completed items', function () {

        cy.createDefaultTodos()

        cy.get('.main ul li').first().as('firstEl').find('[type="checkbox"]').check()

        cy.get('footer ul li:nth-of-type(3)').click().should('have.length', 1)

    })

    it('should allow me to display all items', function () {

        cy.createDefaultTodos()

        cy.get('.main ul li').first().as('firstEl').find('[type="checkbox"]').check()

        cy.get('footer ul li:nth-of-type(3)').click()

        cy.get('footer ul li:nth-of-type(1)').click()

        cy.get('.main li').should('have.length', 3)

    })

    it('should highlight the currently applied filter', function () {

        cy.createDefaultTodos()

        cy.get('footer ul li:nth-of-type(1) a').should('have.class', 'selected')

    })

    it('has good contrast when empty', function () {

        cy.addAxeCode()
        cy.checkA11y()

    })
})





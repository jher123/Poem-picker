import Page from 'classes/Page'

export default class Poem extends Page {
  constructor () {
    super({
      id: 'poem', // we're passing that to the parent Page class
      element: '.poem',
      elements: {
        wrapper: '.poem__wrapper',
        navigation: document.querySelector('.navigation'),
        title: '.poem__title'
      }
    })
  }
}

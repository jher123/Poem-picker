import Page from 'classes/Page'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home', // we're passing that to the parent Page class
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        link: '.home__link',
        navigation: document.querySelector('.navigation')
      }
    })
  }
}

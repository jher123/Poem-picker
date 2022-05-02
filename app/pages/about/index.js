// because we are using webpack, we don't need to provide the whole path

import Page from 'classes/Page'

// those classes will inherit from Page
export default class About extends Page {
  constructor () {
    super({
      id: 'about', // we're passing that to the parent Page class
      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
        navigation: document.querySelector('.navigation'),
        title: '.about__title'
      }
    })
  }
}

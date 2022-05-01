import Component from 'classes/Component'
import each from 'lodash/each'

export default class Preloader extends Component {
  constructor () {
    // get the selectors we need
    super(
      {
        element: '.preloader',
        elements: {
          title: '.preloader__text',
          number: '.preloader__title',
          images: document.querySelectorAll('img')
        }
      }
    )
    console.log(this.element)
  }

  createLoader () {
    each(this.elements.images, image => {
      console.log(image)
    })
  }
}

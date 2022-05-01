import Component from 'classes/Component'
import each from 'lodash/each'
import GSAP from 'gsap'

export default class Preloader extends Component {
  constructor () {
    // get the selectors we need
    super(
      {
        element: '.preloader',
        elements: {
          title: '.preloader__text',
          number: '.preloader__number',
          // 1- select all the images on the website
          images: document.querySelectorAll('img')
        }
      }
    )
    this.length = 0
    console.log(this.element)

    this.createLoader()
  }

  // Basically we are going through all the images,
  // checking which ones have been loaded and when it's loaded,
  // we're checking how many are loaded
  createLoader () {
    // 2 - go through all images and preload all these images
    each(this.elements.images, element => {
      element.src = element.getAttribute('data-src')
      element.onloaded = this.onAssetLoaded
    })
  }

  onAssetLoaded (image) {
    this.length += 1
    const percent = this.length / this.elements.images.length
    // replace the number with the calculate percentage of images loaded
    this.elements.number.inneHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  // hide the preloader before destroying it in the main App class
  onLoaded () {
    return new Promise(resolve => {
      // resolve the promise when the animation is completed
      this.animateOut = GSAP.timeline({
        // include a small delay so that we display the preloader at least for 1 second
        delay: 1
      })

      this.animateOut.to(this.element, {
        autoAlpha: 0
      })

      this.animateOut.call(_ => {

      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}

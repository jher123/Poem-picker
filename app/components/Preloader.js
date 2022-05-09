import Component from 'classes/Component'
import each from 'lodash/each'
import GSAP from 'gsap'
import { split } from 'utils/text'

export default class Preloader extends Component {
  constructor () {
    // get the selectors we need
    super(
      {
        element: '.preloader',
        elements: {
          title: '.preloader__text',
          number: '.preloader__number',
          numberText: '.preloader__number__text',
          // 1- select all the images on the website
          images: document.querySelectorAll('img')
        }
      }
    )
    console.log('Preloader start')

    // replace text to include spans - we do this twice to have 2 spans
    split({
      element: this.elements.title,
      expression: '<br>' // using line breaks to save performance
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titleSpans =
        this.elements.title.querySelectorAll('span span')

    this.length = 0
    // this.createLoader()
    this.onLoaded()
  }

  // 2 - Basically we are going through all the images,
  // checking which ones have been loaded and when it's loaded,
  // we're checking how many are loaded
  createLoader () {
    // 2 - go through all images and preload all these images
    each(this.elements.images, (image) => {
      image.onload = (_) => this.onAssetLoaded(image)
      image.src = image.getAttribute('data-src')
    })
  }

  onAssetLoaded (image) {
    this.length += 1
    const percent = this.length / this.elements.images.length
    // replace the number with the calculate percentage of images loaded
    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onLoaded()
    }
  }

  // hide the preloader before destroying it in the main App class
  onLoaded () {
    console.log('Preloaded loaded')

    return new Promise(resolve => {
      // resolve the promise when the animation is completed
      this.animateOut = GSAP.timeline({
        // include a small delay so that we display the preloader at least for 1 second
        delay: 1
      })

      this.animateOut.to(
        this.elements.titleSpans,
        {
          duration: 1.5,
          ease: 'expo.out', // can check greenstock easings for option
          stagger: 0.1, // it was x to animate the next line
          y: '100%'
        }
      )

      this.animateOut.to(
        this.elements.numberText,
        {
          duration: 1.5,
          ease: 'expo.out',
          stagger: 0.1,
          y: '100%'
        },
        '-=1.4'
      )

      this.animateOut.to(this.element, {
        scaleY: 0,
        // 0 0 would be slide out up to the top
        transformOrigin: '100% 100%',
        duration: 1.5,
        ease: 'expo.out'
      }, '-=1')

      this.animateOut.call(_ => {
        this.emit('completed')
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}

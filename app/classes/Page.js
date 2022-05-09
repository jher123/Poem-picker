import each from 'lodash/each'
import map from 'lodash/map'
import GSAP from 'gsap'
import Prefix from 'prefix'
import NormalizeWheel from 'normalize-wheel'
import Title from 'animations/Title'
import Paragraph from '../animations/Paragraph'
import Label from '../animations/Label'
import { ColorsManager } from 'classes/Colors'
import AsyncLoad from 'classes/AsyncLoad'

export default class Page {
  constructor ({
    id,
    element,
    elements
  }) {
    this.id = id
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',

      // this is for the image preloader
      preloaders: '[data-src]'
    }

    // we could use the equivalent function from Greenstock but he prefers to use prefix
    // to have more control
    this.transformPrefix = Prefix('transform')

    // smooth scrolling variables
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      // scroll limit
      limit: 0
    }

    // important!
    this.onMouseWheelEvent = this.onMouseWheel.bind(this)
  }

  // This creation method will behave like ComponentDidMount in React
  create () {
    // This is so we querySelector all the things that we'll pass to the constructor so that selectors will be passed to the class,
    // and we'll only to do that only when the class is initialised so we save memory
    this.element = document.querySelector(this.selector)

    // This will be a map of all elements
    this.elements = {}

    // smooth scrolling variables
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    // Automatically select all the selectors
    each(this.selectorChildren, (entry, key) => {
      // This is useful when we pass DOM elements
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          // replace an empty Node list with null
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
        // extract the element from the list because it's hard to work with lists
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    this.createAnimations()
    this.createPreloader()
  }

  // Aync image preloader
  createPreloader () {
    this.preloaders = map(this.elements.preloaders, element => {
      return new AsyncLoad({ element })
    })
  }

  createAnimations () {
    // create an array to simplify
    this.animations = []

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({
        element
      })
    })

    this.animations.push(...this.animationsTitles)

    // Paragraphs
    this.animationsParagraphs = map(this.elements.animationsParagraphs, (element) => {
      return new Paragraph({
        element
      })
    })
    this.animations.push(...this.animationsParagraphs)

    // Labels
    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({
        element
      })
    })
    this.animations.push(...this.animationsLabels)
  }

  //  By including default animation here in this file we are able to have default animations all around the app.
  //  This is the beauty of using plain JS and object orientation, it would be harder with React.
  show () {
    return new Promise(resolve => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })

      // we're using a timeline cos we want to include more stuff -
      // add eventlisteners when all the animations are completed
      this.animationIn = GSAP.timeline()
      // we're animating the page in from opacity 0 to 1
      this.animationIn.fromTo(
        this.element,
        { autoAlpha: 0 },
        { autoAlpha: 1 }
      )

      this.animationIn.call(_ => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
    // remove event listeners becasue we want to remove all
    //  the smooth scrolling stuff before the page is hidden
      this.removeEventListeners()

      this.animationOut = GSAP.timeline()
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  // There's multiple ways to hijack scroll but he prefers to use the values of the mousewheel event and
  // do a small calcluation bcs it's going to match the values from webgl
  onMouseWheel (event) {
    // we're using this library to normalize it between different browsers
    const { pixelY } = NormalizeWheel(event)

    this.scroll.target += pixelY
  }

  onResize () {
    if (this.elements.wrapper) {
      this.scroll.limit =
          this.elements.wrapper.clientHeight - window.innerHeight
    }

    // this for animation
    each(this.animations, animation => animation.onResize())
  }

  // This method is being continously called in the main App
  update () {
    // Lerping is used for doing smooth transitions between one value and another- interpolation values.
    // We're going to use this concept for implementing smooth scrolling.

    // clamp scroll target so it's always between 0 and current
    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)

    // 0.1 is the easing of interpolation - the lower the number the smoother it will be ]
    // but this can have performance implications so he usually just uses 0.1
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    // Because JS doesn't handle 0 well
    if (this.scroll.current < 0.01) {
      this.scroll.current = 0
    }

    // this wrapper needs to be set in all the views
    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent)
  }
}

import Animation from 'classes/Animation'
import GSAP from 'gsap'
import { split, calculate } from 'utils/text'
import each from 'lodash/each'

export default class Title extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    // MASK ANIMATION
    // here instead of using the expression like in the preloader, we'll calculate span
    // using a handy function
    // append automatically includes space afte each
    split({
      element: this.element, append: true
    })

    split({
      element: this.element, append: true

    })

    // splitting the lines for a cool animation like in the preloader
    this.elementLinesSpans = this.element.querySelectorAll('span span')
  }

  // here we can just call Greenstock
  // in these animations he doesn't apply any easings because when the element is out of the viewport
  // we want to hide it as fast as we can
  animateIn () {
    // timelines imporve things

    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    this.timelineIn.set(this.element, {
      autoAlpha: 1
    })

    each(this.elementsLines, (line, index) => {
      this.timelineIn.fromTo(line, {
        y: '100%'
      }, {
        // Good practice with IO is to include small delays like 0.5 so the user can see animation
        delay: index * 0.2,
        duration: 1.5,
        ease: 'expo.out',
        y: '0%'
      }, 0) // we use 0 so it doesn't wait for the previous animation to finalise
    })
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  // call this on the parent Page class
  onResize () {
    this.elementsLines = calculate(this.elementLinesSpans)
  }
}

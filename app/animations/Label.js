import Animation from 'classes/Animation'
import GSAP from 'gsap'
import { split, calculate } from 'utils/text'
import each from 'lodash/each'

export default class Label extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({
      element: this.element, append: true

    })
  }

  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })

    this.timelineIn.set(this.element, { autoAlpha: 1 })

    each(this.elementsLines, (line, index) => {
      GSAP.fromTo(line, {
        y: '100%',
        autoAlpha: 0
        // the diff between this and the Title animation is that we also include alpha here
      }, {
        autoAlpha: 1,
        delay: index * 0.2,
        duration: 1.5,
        ease: 'expo.out',
        y: '0%'
      }, 0)
    })
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementsLines = calculate(this.elementLinesSpans)
  }
}

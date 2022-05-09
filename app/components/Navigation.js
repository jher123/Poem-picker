import Component from 'classes/Component'
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from 'utils/colors'
import GSAP from 'gsap'

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.onChange(template)
  }

  // this will check for the current template we're on and display the correct thing (because now it's overlapping),
  // same for body color
  onChange (template) {

  }
}

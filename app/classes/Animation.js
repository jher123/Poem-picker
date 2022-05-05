import Component from 'classes/Component'

// we extend from Components because we want to use the selector features it has
export default class Animation extends Component {
  constructor ({ element, elements }) {
    super({ element, elements })

    this.createObserver()
    this.animateOut()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // when the element is in the viewport it will animate in
          this.animateIn()
        } else {
          // when it's out of the viewport it will animate out
          this.animateOut()
        }
      })
    })

    // we'll listen for changes in this element and based on it, we'll want to animate in or out
    this.observer.observe(this.element)
  }

  // including these here so it doesn't complain when they are undefined
  animateIn () {

  }

  animateOut () {

  }

  onResize () {

  }
}

// IO is an APi from JS that will tell you when an element is in the viewport. it works asynchronously.
// We can use it for animating in elements when they are in the viewport - this is the approach he used in Garoa

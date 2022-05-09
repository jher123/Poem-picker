import Component from 'classes/Component'

// this for asynchronous loading of images - they only load as I scroll down the page.
// Good to use for example for portfolios.
export default class AsyncLoad extends Component {
  constructor ({ element }) {
    super({
      element
    })

    this.createObserver()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.element.src) {
          // check for the image
            this.element.src = this.element.getAttribute('data-src')
            // to avoid flashes of images - this + look at img CSS
            this.element.onload = _ => {
              this.element.classList.add('.loaded')
            }
          }
        }
      })
    })
  }
}

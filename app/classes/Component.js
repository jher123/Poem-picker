import each from 'lodash/each'
import EventEmitter from 'events'

// He usually uses nodejs event, where he can create an event and
// listen to it whilst something else happens.
// E.g. in the preloader we need to load images and only when they are loaded, we need
// to animate the preloader out.

// He usually has a Component class extendung from
// event emitter class from Nodejs. It will create custom events
// for you and you can include listener.s
export default class Component extends EventEmitter {
  constructor ({
    element,
    elements
  }) {
    // We need to call super() to initialise the constructor of the parent class
    super()
    this.selector = element
    this.selectorChildren = {
      ...elements
    }
    // Call create() automatically because we don't need to initlaise that in a specific moment
    this.create()
    this.addEventListeners()
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}
    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })
  }

  //  by including default animation here in this file we are able to have default animations all around the app
  //  this is the beauty of using plain JS and object orientation, it would be harder with React
  addEventListeners () {

  }

  removeEventListeners () {

  }
}

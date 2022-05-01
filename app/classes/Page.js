import each from 'lodash/each'
import GSAP from 'gsap'

// Object oriented orientation using JS -
// it doesn't make sense to create class in these diff files and copying the same methids and functions over and over again for each of thise diff pages
// it's creating a file where we can extend and extend diff methods and functions into other classes
export default class Page {
  constructor ({
    id,
    element,
    elements
  }) {
    this.id = id
    this.selector = element
    this.selectorChildren = {
      ...elements
    }
  }

  // This creation method will behave like ComponentDidMount in React
  create () {
    // This is so we querySelector all the things that we'll pass to the constructor so that selectors will be passed to the class,
    // and we'll only to do that only when the class is initialised so we save memory
    this.element = document.querySelector(this.selector)

    // This will be a map of all elements
    this.elements = {}

    // Automatically select all the selectors
    each(this.selectorChildren, (entry, key) => {
      console.log(entry)
      // This is useful when we pass DOM elements
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          // instead of an empty Node list replace with null
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
        // extract the element from the list because it's hard to work with lists
          this.elements[key] = document.querySelector(entry)
        }
      }
    }
    )
  }

  //  By including default animation here in this file we are able to have default animations all around the app.
  //  This is the beauty of using plain JS and object orientation, it would be harder with React.
  show () {
    return new Promise(
      // resolve the Promise when animation is finalised
      resolve => {
        GSAP.from(this.element, {
          autoAlpha: 0,
          onComplete: resolve
        })
      }
    )
  }

  hide () {
    return new Promise(
      resolve => GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    )
  }
}

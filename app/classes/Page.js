import each from 'lodash/each'

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

  // this creation method will behave like ComponentDidMount in React
  create () {
    // this is so we query selector all the things that we'll pass to the constrcutor so that selectors will be passed to the class, and we'll only to do
    // that only when the class is initlaised so we save memeory
    this.element = document.querySelector(this.selector)

    // this will be a map of all elements
    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      console.log(entry)
      //   this is useful when we pass DOM elements
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          // instead of an emoty Node list replace with null
          this.elements[key] = null
        } else if (this.elements[key].length === 1)
        // extract the element from the list because it's hard to work with lists
        {
          this.elements[key] = document.querySelector(entry)
        }
      }

      // if it's just one element return one element, if it's nothing return null
      console.log(this.elements[key], entry)
    }
    )
  }
}

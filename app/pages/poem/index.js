// export default class Poem extends Page {
//   constructor () {
//     super({
//       id: 'poem', // we're passing that to the parent Page class
//       element: '.poem',
//       elements: {
//         wrapper: '.poem__wrapper',
//         navigation: document.querySelector('.navigation'),
//         title: '.poem__title'
//       }
//     })
//   }
// }

import each from 'lodash/each'

import Detection from 'classes/Detection'
import Page from 'classes/Page'

import { delay } from 'utils/math'

export default class Poem extends Page {
  constructor () {
    super({
      element: '.poems',
      elements: {
        wrapper: '.poems__wrapper',
        // cases: '.poem',
        navigation: document.querySelector('.navigation')
      }
    })

    this.url = window.location.pathname
    this.classes = {
      active: 'poems--active',
      caseActive: 'poem--active',
      mediaActive: 'poem__gallery__media__placeholder--active'
    }

    // TODO: do I need this here? (there's a call in entrypoint)
    // this.create()
  }
}

/**
   * Animations.
   */
//   show (url) {
//     console.log(this.element.classList)

//     this.element.classList.add(this.classes.active)

//     const id = this.url.replace('/poem/', '').replace('/', '')
//     console.log(this.url)

//     // TODO: commented out wrapper AnimationPlaybackEvent, do I need this?
//     // this.elements.wrapper = Array.from(this.elements.cases).find(item => item.id === id)
//     // this.elements.wrapper.classList.add(this.classes.caseActive)

//     if (Detection.isMobile()) {
//       this.elements.image = this.elements.wrapper.querySelector('.poem__media__image')

//       const medias = this.elements.wrapper.querySelectorAll('.poem__gallery__media__placeholder')

//       each(medias, media => {
//         const image = new Image()

//         image.className = 'poem__gallery__media__image'
//         // image.src = media.getAttribute(Detection.isWebPSupported() ? 'data-src-webp' : 'data-src')
//         image.src = media.getAttribute('data-src')
//         image.decode().then(_ => {
//           media.classList.add(this.classes.mediaActive)
//           media.appendChild(image)
//         })
//       })

//       return super.show()
//     }
//   }

//   async hide () {
//     this.scroll.target = 0

//     this.elements.wrapper.classList.remove(this.classes.caseActive)

//     this.element.classList.remove(this.classes.active)

//     await delay(Detection.isMobile() ? 400 : 1000)

//     return super.hide()
//   }

//   /**
//    * Events
//    */
//   onResize () {
//     super.onResize()

//     each(this.elements.poems, element => {
//       element.limit = element.clientHeight
//     })
//   }
// }

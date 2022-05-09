import each from 'lodash/each'
import About from 'pages/About'
import Home from 'pages/Home'
import Preloader from 'components/preloader'
import Navigation from 'components/Navigation'

class App {
  constructor () {
    // Canvas has to be created first so we first call createContent. The remaining functions order doesn't matter.
    // this.createContent()

    this.url = window.location.pathname

    this.createPreloader()
    this.createNavigation()

    this.createHome()
    this.createAbout()

    this.pages = {
      '/': this.home,
      '/about': this.about
    }

    this.page = this.pages[this.url]
    this.page.show(this.url)

    this.addEventListeners()
    this.addLinkListeners()

    // this function will be called over and over in each frame of the browser
    this.update()
  }

  createPreloader () {
    console.log('Create preloader')
    this.preloader = new Preloader({})
    // binding is related wit the closure thing
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  // The content element allows to initialise only the page we're currently on
  // createContent () {
  //   this.content = document.querySelector('.content')
  //   // this returns a string, the name of the page
  //   this.template = this.content.getAttribute('data-template')
  // }

  createNavigation () {
    console.log('Create nav')
    this.navigation = new Navigation({
      template: this.url
    })
  }

  createAbout () {
    console.log('Create about')
    this.about = new About()
    this.about.create()
  }

  createHome () {
    console.log('Create home')
    this.home = new Home()
    this.home.create()
  }

  /**  Events ***/
  onPreloaded () {
    // destroy it (only after it's hidden)
    this.preloader.destroy()

    // call this here because smoothscroll is very sensitive to innerHeight
    this.onResize()

    // the page is only animated once all the website is preloaded
    this.page.show()
  }

  async onChange (url = null, push = true) {
    url = url.replace(window.location.origin, '')

    // 1 -- if I want to go to another page, the first thing I need to do is animate out my current page
    await this.page.hide()

    // 2 -- fetching the new page
    const request = await window.fetch(url)

    this.url = url

    if (request.status === 200) {
      const html = await request.text()
      // we're creating a fake div here to append the html of the requested page
      const div = document.createElement('div')

      // update the slug to the new page's one
      if (push) {
        window.history.pushState({}, '', url)
      }

      div.innerHTML = html
      // overriding the html with the new page html
      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      // for navigation we won't have any listeners, we'll just call onChnage here
      this.navigation.onChange(this.url)

      // update content
      this.content.innerHTML = divContent.innerHTML

      // 3 -- displaying brand new page
      this.page = this.pages[this.url]
      this.page.create()

      this.onResize()
      this.page.show()

      // this is so that we also listen to events in content links - like the button
      this.addLinkListeners()
    } else {
      console.log('error')
    }
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  /**  Loop ***/
  update () {
    // bind here is about closures
    if (this.page && this.page.update) {
      this.page.update()
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /**  Listeners ***/
  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    // This method will go through all links on the website
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        // We avoid redirecting here
        event.preventDefault()

        // Instead we'll use fetch API to request the page without having to refresh the page for the user
        // we are fetching the page without leaving the previous one.
        // This is the way to implement what React is doing with AJAX.
        const { href } = link

        this.onChange(href)
      }
    })
  }
}

new App()

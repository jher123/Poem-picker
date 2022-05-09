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
      '/about': this.about,
      // TODO: hack -when going directly to route, browser adds / so without this double entry here there's an error
      '/about/': this.about
    }
    this.page = this.pages[this.url]

    this.addEventListeners()
    this.addLinkListeners()

    // this function will be called over and over in each frame of the browser
    this.update()
  }

  createPreloader () {
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
    console.log('On preloaded call')

    // TODO: estroy it (only after it's hidden)
    this.preloader.destroy()
    console.log('preloader destroyed')

    // call this here because smoothscroll is very sensitive to innerHeight
    this.onResize()

    // the page is only animated once all the website is preloaded
    this.page.show()
  }

  async onChange (url = null, push = true) {
    url = url.replace(window.location.origin, '')

    if (this.isFetching || this.url === url) return

    this.isFetching = true

    this.url = url

    if (this.canvas) {
      this.canvas.onChange(this.url)
    }

    // animate out my current page before going to the next page
    await this.page.hide()

    // update the slug to the new page's one
    if (push) {
      window.history.pushState({}, '', url)
    }

    // change navigation links?
    this.navigation.onChange(this.url)

    // displaying the new page
    this.page = this.pages[this.url]
    this.page.create()

    this.onResize()
    await this.page.show()
    // this.page.show() // instead ??

    // this is so that we also listen to events in content links - like the button
    this.addLinkListeners()

    this.isFetching = false
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

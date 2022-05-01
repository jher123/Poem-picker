import each from 'lodash/each'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'
import Preloader from 'components/preloader'

class App {
  constructor () {
    //  We put this log at the start to make sure it's actually working
    this.createPreloader()

    this.createContent()
    this.createPages()
    this.addLinkListeners()
  }

  createPreloader () {
    this.preloader = new Preloader({})
    // binding is related wit the closure thing
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  onPreloaded () {
    // destroy it (only after it's hidden)
    this.preloader.destroy()

    // the page is only animated once all the website is preloaded
    this.page.show()
  }

  // The content element allows to initialise only the page we're currently on
  createContent () {
    this.content = document.querySelector('.content')
    // this returns a string, the name of the page
    this.template = this.content.getAttribute('data-template')
  }

  // Firstly we need to create new pages - this can be a map of all pages we're going to initalise
  createPages () {
    // there's 2 ways to do it - we can either create those classes here in the constructor
    // or another method, we can destroy them or not, ususally he doesn't destroy them, he just creates add and remove listeners
    // because it can be consuming for the browser keeping track of destroying and creating classes
    this.pages = {
      home: new Home(),
      collections: new Collections(),
      about: new About(),
      detail: new Detail()
    }

    // Now we get this page (so 'home' or 'about' etc.) - this only initialises the classes taht we're using.
    // This allows us to create one page at once.
    this.page = this.pages[this.template]
    this.page.create()
    // this could be here but we moved it so it's only after preloader is destroyed
    // this.page.show()
  }

  async onChange (url) {
    // 1 -- if I want to go to another page, the first thing I need to do is animate out my current page
    await this.page.hide()

    // 2 -- fetching the new page
    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      // we're creating a fake div here to append the html of the requested page
      const div = document.createElement('div')
      div.innerHTML = html
      // overriding the html with the new page html
      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      // let's also update the slug to the new page's one
      this.content.setAttribute('data-template', divContent.getAttribute('data-attribute'))
      this.content.innerHTML = divContent.innerHTML

      // 3 -- displaying brand new page
      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()

      // this is so that we also listen to events in content links - like the button
      this.addLinkListeners()

    //   console.log(html)
    } else {
      console.log('error')
    }
  }

  addLinkListeners () {
    // This method will go through all links on the website (using lodash)
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        // we avoid redirecting here
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

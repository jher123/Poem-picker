import each from 'lodash/each'
import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App {
  constructor () {
    //   we put this log at the start to make sure it's actually working
    // console.log('APP')
    this.createContent()
    this.createPages()
    this.addLinkListeners()
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
    console.log(this.template)
    // this returns a string, the name of the page
  }

  // firstly we need to create new pages
  // this can be a map of all pages we'er going to initalise
  createPages () {
    // there's 2 ways to do it - we can either create those classes here in the constructor
    // we can either initlaise all our classes here or anther method, we can destroy then or not, ususally he doesn't destroy then, he just creates add and remove listeners
    // because it can consuming for the browser keeping track of destroying and creating classes
    this.pages = {
      home: new Home(),
      collections: new Collections(),
      about: new About(),
      detail: new Detail()
    }
    // console.log(this.pages)

    // now we get this page (so 'home' or 'about' etc.) - this only initlaises the classes taht we're using
    // this allows us to create one page at once
    this.page = this.pages[this.template]
    this.page.create()
    // this.page.show()
    // this.page.hide()
  }

  async onChange (url) {
    // 1 -- if I want to go to another page, the first thing I need to do is animate out my current page
    await this.page.hide()

    // 2 -- fetching the new page
    const request = await window.fetch(url)
    console.log(request)
    if (request.status === 200) {
      const html = await request.text()
      // we're creating a fake div here to append the html of the requested page
      const div = document.createElement('div')
      div.innerHTML = html
      // overrriding the html with the new page html
      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      // let's also update the slug to the new page's one
      this.content.setAttribute('data-template', divContent.getAttribute('data-attribute'))
      this.content.innerHTML = divContent.innerHTML

      // 3 -- displaying brand new page
      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()

    //   console.log(html)
    } else {
      console.log('error')
    }
  }

  addLinkListeners () {
    // this methid will go through all links on the website (using lodash)
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        // we avoid redirecting here
        event.preventDefault()

        // instead we'll use fetch API to request the page without having to refresh the page for the user
        // we are fetching the page without leaving the previous on
        // this is the way to impelment what React is doing with AJAX
        const { href } = link

        this.onChange(href)
      }
    })
  }
}
// Object oriented orientation using JSS-
// it doesn't make sense to create class in these diff files and copying the same methids and functions over and over again for each of thise diff pages
// it's creating a file where we can extend and extend diff methods and functions into other classes
new App()

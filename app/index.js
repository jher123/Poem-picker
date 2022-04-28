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
  }
}

// Object oriented orientation using JSS-
// it doesn't make sense to create class in these diff files and copying the same methids and functions over and over again for each of thise diff pages
// it's creating a file where we can extend and extend diff methods and functions into other classes
new App()

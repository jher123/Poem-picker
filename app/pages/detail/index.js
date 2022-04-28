import Page from 'classes/Page'

export default class Detail extends Page {
  constructor () {
    super({
      id: 'detail', // we're passing that to the parent Page class
      element: '.detail'
    })
  }
}

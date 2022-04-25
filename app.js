require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
// const find = require('lodash/find')

// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getGraphQLEndpoint(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

// Link Resolver
const handleLinkResolver = doc => {
  // Define the url depending on the document type
  //   if (doc.type === 'page') {
  //     return '/page/' + doc.uid;
  //   } else if (doc.type === 'blog_post') {
  //     return '/blog/' + doc.uid;
  //   }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

// app.use((request, response, next) => {
//   const accessToken = process.env.PRISMIC_ACCESS_TOKEN
//   const endpoint = process.env.PRISMIC_ENDPOINT

//   response.locals.PrismicDOM = PrismicDOM

//   Prismic.api(endpoint, {
//     accessToken,
//     request
//   }).then(api => {
//     request.prismic = { api }

//     next()
//   }).catch(error => {
//     next(error.message)
//   })
// })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home', {
    meta: {
      data: {
        title: 'Floema',
        description: 'Metadata description'
      }
    }
  })
})

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.predicate.any('document.type', ['meta', 'About'])).then(response => {
      const { results } = response
      const [about, meta] = results

      res.render('pages/about', {
        about,
        meta
      })
    })
  })
})

//   res.render('pages/about', {
//     meta: {
//       data: {
//         title: 'Floema',
//         description: 'Metadata description'
//       }
//     }
//   })
// })

app.get('/detail/:id', (req, res) => {
  res.render('pages/detail', {
    meta: {
      data: {
        title: 'Floema',
        description: 'Metadata description'
      }
    }
  })
})

app.get('/collections', (req, res) => {
  res.render('pages/collections', {
    meta: {
      data: {
        title: 'Floema',
        description: 'Metadata description'
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

# [dontkry.com](http://dontkry.com)

My over-engineered blog.

## install

- `git clone git://github.com/shama/dontkry.com && cd dontkry.com`
- `npm install`

## build

- `npm start` - visit the url `http://localhost:9966` to view.
- `npm run build` - builds the static assets to `dist/` folder.

## how this works

`index.js` is the client side entry point to the app. It create a router and
app view. Then handles the transition states and loads the initial route.

`app/router.js` handles the routes. It uses `app/api` to request our data
source, or in this case markdown files from the server.

Once the markdown file is downloaded, it sends the data to the appropriate
`app/views/`. The views use [yo-yo](https://github.com/maxogden/yo-yo) to turn
the data into HTML elements.

The router then indicates it has successfully resolved and passes the element
to the `app/index.js` to render the complete page.

### server side

`build.js` gathers all the potential routes. Then feeds them to `server.js`
to manually trigger the router on each route. Instead of rendering an element
on each transition, it builds a static HTML file for the route.

The `app/api` scripts know to request the local file using `require('fs')` if
we are on the server side.

We compile a `content/index.json` for the home page to display a list of content
available. Then compiles the JavaScript and CSS.

As the user visits the page, they receive the static assets. Then after the
JavaScript loads, it replaces the app mount point with the dynamic content.

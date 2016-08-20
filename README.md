# Boilerplate for the next hapi based application
Things might change

# Folder structure
The basic idea is to keep every `resource` separated from the rest.

The structure is quite easy:

* `config` folder - put your config related info there
** in the boilerplate you'll find the `manifest.json` inside - it's used by `Glue` to provision the server
* `test` folder, contains of the tests and `fixtures`
* `lib` folder - folder for your routes
* `modules` - holds all the resources
* `beers` - represents a folder with everything related to beers. It consists of following folders/files:

* `index.js` - describes which operations can be performed on `beers` resource
* `package.json` - describes the `beers` plugin - `name` and `version`
* `handlers` folder - keeps all handler files e.g. `createBeer.js`/`updateBeer.js`/`getBeers.js`/`getBeer.js`/`deleteBeer.js` etc.
* `schemas` folder - holds `Joi` validation schemas for any operation you need e.g. `beer.js`/`createBeer.js` etc.
* `utils` - any additional stuff your `beers` need e.g. `calculateAlc.js` etc.

# Postman Collection to play around
https://www.getpostman.com/collections/bc43899d045d6a2ad1e0

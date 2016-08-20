# Prerequisites
If you haven't installed `brew` on your machine yet - do it `fucking` NOW
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

1. MongoDB

```
brew update
```

Install with or without SSL/TLS support:

```
brew install mongodb
```

or

```
brew install mongodb --with-openssl
```

2. node && npm
```
brew install node
```

It should install `npm` as well.

3. install node_modules
From the `hapi-bolerplate` directory run:
```
npm install
```

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

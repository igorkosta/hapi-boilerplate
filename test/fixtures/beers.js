// beers.js
var id = require('pow-mongodb-fixtures').createObjectId;

var beers = exports.beers = {
  beer1: {
    _id: id(),
    name: "IPA from Hell",
    type: "IPA",
    alcohol: "6.6"
  },
  beer2: {
    _id: id(),
    name: "Lager from Hell",
    type: "Lager",
    alcohol: "7.7"
  },
  beer1: {
    _id: id('4ed2b809d7446b9a0e000014'),
    name: "Dark Beer from Hell",
    type: "Dark Beer",
    alcohol: "8.8"
  }
}

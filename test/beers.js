'use strict';

// Load modules

const Hapi = require('hapi');
const Lab = require('lab');
const Code = require('code');
const Boom = require('boom');
const chai = require('chai');
const beers = require('../lib/modules/beers')
const fixtures = require('pow-mongodb-fixtures').connect('beerstore_test');
var id = require('pow-mongodb-fixtures').createObjectId;
const mongojs = require('mongojs');


// shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

lab.experiment('Beers module', () => {

  lab.beforeEach((done) => {

    fixtures.clear(function(err) {
      if (err) {
        return reply(Boom.badData('Could not clear the database', err));
      }

      fixtures.load(__dirname + '/fixtures', function(err) {
        if (err) {
          return reply(Boom.badData('Could not load fixtures', err))
        }

        done();
      });
    });
  });

  lab.test('put a beer on the shelf', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'POST',
        url: '/beers',
        payload: {
          name: "IPA from Paradise",
          type: "IPA",
          alcohol: "6.6"
        }
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(201);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( { name: "IPA from Paradise",
                                              type: "IPA",
                                              alcohol: 6.6
                                          } )
        done()
      })
    })
  });

  lab.test('tries to put a put a beer on the shelf and the db connection drops', (done) => {
    var server = new Hapi.Server()
    server.connection();
    const db = mongojs('beerstore_test');
    server.app.db = db;
    // emulates dropped db connection
    db.close();
    // emulates dropped db connection
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'POST',
        url: '/beers',
        payload: {
          name: "IPA from Paradise",
          type: "IPA",
          alcohol: "6.6"
        }
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(422);
        expect(response.result).to.include( {
                                              "statusCode": 422,
                                              "error": "Unprocessable Entity",
                                              "message": "Internal MongoDB error"
                                          } )
        done()
      })
    })
  });

  lab.test('gets a list of beers', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/beers'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200);
        chai.expect(response.result).to.be.json;
        chai.expect(response.result).to.be.an.array;
        chai.expect(response.result).to.have.length(3);
        done()
      })
    })
  });

  lab.test('tries to get a list of beers and db connection drops', (done) => {
    var server = new Hapi.Server()
    server.connection();
    const db = mongojs('beerstore_test');
    server.app.db = db;
    db.close();
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/beers'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(422);
        expect(response.result).to.include( {
                                              "statusCode": 422,
                                              "error": "Unprocessable Entity",
                                              "message": "Internal MongoDB error"
                                          } )
        done();
      })
    })
  });

  lab.test('gets a certain beer', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/beers/4ed2b809d7446b9a0e000014'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200);
        chai.expect(response.result).to.be.json;
        chai.expect(response.result).to.include( { // _id: id("4ed2b809d7446b9a0e000014"), //still have to figure this mongo _id shit out
                                                   name: "Dark Beer from Hell",
                                                   type: "Dark Beer",
                                                   alcohol: "8.8"
                                                } )

        done()
      })
    })
  });


  lab.test('beer not found', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/beers/4ed2b809d7446b9a0e000666'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(404);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( {
                                              "statusCode": 404,
                                              "error": "Not Found"
                                           } )

        done()
      })
    })
  });

  lab.test('beer not found because of the wrong {id}', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/beers/foobar'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(400);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( {
                                              "statusCode": 400,
                                              "error": "Bad Request",
                                              "message": "child \"id\" fails because [\"id\" length must be at least 24 characters long]",
                                              "validation": {
                                                "source": "params",
                                                "keys": [
                                                  "id"
                                                ]
                                              }
                                            } )

        done()
      })
    })
  });

  lab.test('deletes a beer', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'DELETE',
        url: '/beers/4ed2b809d7446b9a0e000014'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        done()
      })
    })
  });

  lab.test('tries to delete a beer and connection to db drops', (done) => {
    var server = new Hapi.Server()
    server.connection();
    const db = mongojs('beerstore_test');
    server.app.db = db;
    // emulates dropped db connection
    db.close();
    // emulates dropped db connection
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'DELETE',
        url: '/beers/4ed2b809d7446b9a0e000014'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(422);
        expect(response.result).to.include( {
                                              "statusCode": 422,
                                              "error": "Unprocessable Entity",
                                              "message": "Internal MongoDB error"
                                          } )
        done()
      })
    })
  });


  lab.test('tries to delete a beer that does not exist', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'DELETE',
        url: '/beers/4ed2b809d7446b9a0e000015'
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.result).to.include( {
                                              "statusCode": 404,
                                              "error": "Not Found"
                                            } )
        done()
      })
    })
  });


  lab.test('updates a beer', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('beerstore_test');
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/beers/4ed2b809d7446b9a0e000014',
        payload: {
          name: "Dark Beer from Hell Strikes Back and becomes Lager",
          type: "Lager",
          alcohol: "8.8"
        }
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        done()
      })
    })
  });

  lab.test('tries to update a beer and connection to db drops', (done) => {
    var server = new Hapi.Server()
    server.connection();
    const db = mongojs('beerstore_test');
    server.app.db = db;
    // emulates dropped db connection
    db.close();
    // emulates dropped db connection
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/beers/4ed2b809d7446b9a0e000014',
        payload: {
          name: "Dark Beer from Hell Strikes Back and becomes Lager",
          type: "Lager",
          alcohol: "8.8"
        }
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(422);
        expect(response.result).to.include( {
                                              "statusCode": 422,
                                              "error": "Unprocessable Entity",
                                              "message": "Internal MongoDB error"
                                          } )
        done()
      })
    })
  });

  lab.test('tries to update a beer that does not exist', (done) => {
    var server = new Hapi.Server()
    server.connection();
    const db = mongojs('beerstore_test');
    server.app.db = db;
    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/beers/4ed2b809d7446b9a0e000015',
        payload: {
          name: "Dark Beer from Hell Strikes Back and becomes Lager",
          type: "Lager",
          alcohol: "8.8"
        }
      }
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(404);
        expect(response.result).to.include( {
                                              "statusCode": 404,
                                              "error": "Not Found"
                                            } )
        done()
      })
    })
  });

});

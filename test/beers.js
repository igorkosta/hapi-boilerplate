'use strict';

// Load modules

const Hapi = require('hapi');
const Lab = require('lab');
const Code = require('code');
const Boom = require('boom');
const chai = require('chai');
const beers = require('../lib/modules/beers')
const fixtures = require('pow-mongodb-fixtures').connect('beerstore_test');
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

        console.log('Fixtures loaded successfully!!!')
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
        Code.expect(response.statusCode).to.equal(201);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( { name: "IPA from Paradise",
                                              type: "IPA",
                                              alcohol: 6.6
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
        Code.expect(response.statusCode).to.equal(200);
        chai.expect(response.result).to.be.json;
        chai.expect(response.result).to.be.an.array;
        chai.expect(response.result).to.have.length(3);
        done()
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
        Code.expect(response.statusCode).to.equal(200);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( { _id: id('4ed2b809d7446b9a0e000014'),
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
        Code.expect(response.statusCode).to.equal(404);
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
        Code.expect(response.statusCode).to.equal(400);
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
        Code.expect(response.statusCode).to.equal(204);
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
        Code.expect(response.statusCode).to.equal(404);
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
          title : "4th. App, maybe",
          description : "You have to be serious",
          provider : "CS is for Computer Science",
          appUrl : "http://4thapp.com"
        }
      }
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(204);
        done()
      })
    })
  });

  lab.test('updates a beer and connection to mongo disappears', (done) => {
    var server = new Hapi.Server()
    server.connection();
    // server.app.db  =  mongojs( 'appstore_test', ['bots'], {connectionTimeout: 3000} );
    server.app.db = mongojs('mongodb://localhost:27017/beerstore_test')

    server.register(beers, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/beers/4ed2b809d7446b9a0e000014',
        payload: {
          title : "4th. App, maybe",
          description : "You have to be serious",
          provider : "CS is for Computer Science",
          appUrl : "http://4thapp.com"
        }
      }
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(204);
        done()
      })
    })
  });
});

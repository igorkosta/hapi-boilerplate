'use strict';

// Load modules

const Hapi = require('hapi');
const Lab = require('lab');
const Code = require('code');
const Boom = require('boom');
const chai = require('chai');
const apps = require('../lib/modules/apps')
const fixtures = require('pow-mongodb-fixtures').connect('appstore_test');
const mongojs = require('mongojs');


// shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

lab.experiment('Apps module', () => {

  lab.beforeEach((done) => {
    fixtures.clear(function(err) {
      if (err) {
        return reply(Boom.badData('Could not clear the database', err));
      }

      fixtures.load(__dirname + '/fixtures', function(err) {
        if (err) {
          return reply(Boom.badData('Could not load fixtures', err))
        }

        // console.log('Fixtures loaded successfully!!!')
        done();
      });
    });
  });

  lab.test('creates an app', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'POST',
        url: '/apps',
        payload: {
          title : "1. App",
          description : "Whatever",
          provider : "God himself",
          appUrl : "http://1app.com"
        }
      }
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(201);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( { title: '1. App',
                                              description: 'Whatever',
                                              provider: 'God himself',
                                              appUrl: 'http://1app.com' } )
        expect(response.result['client_id']).to.have.length(16);
        expect(response.result['client_secret']).to.have.length(32);
        // expect(response.result['created']).to.be.a.date();
        done()
      })
    })
  });

  lab.test('gets a list of apps', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/apps'
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

  lab.test('gets a certain app', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/apps/4ed2b809d7446b9a0e000014'
      }
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200);
        chai.expect(response.result).to.be.json;
        expect(response.result).to.include( { title: "3. App",
                                              description: "3rd and last app",
                                              provider: "Judas",
                                              appUrl: "http://3app.com",
                                              type: "mobile",
                                              category: "finance",
                                              client_id: "445787f3a5ce038b",
                                              client_secret: "8b6950fc70af9ddaef33e8b72d0c247d" } )

        done()
      })
    })
  });


  lab.test('app not found', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/apps/4ed2b809d7446b9a0e000666'
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

  lab.test('app not found', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'GET',
        url: '/apps/foobar'
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

  lab.test('deletes an app', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'DELETE',
        url: '/apps/4ed2b809d7446b9a0e000014'
      }
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(204);
        done()
      })
    })
  });

  lab.test('tries to delete an app that does not exist', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'DELETE',
        url: '/apps/4ed2b809d7446b9a0e000015'
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


  lab.test('updates an app', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/apps/4ed2b809d7446b9a0e000014',
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

  lab.test('updates an app and connection to mongo disappears', (done) => {
    var server = new Hapi.Server()
    server.connection();
    // server.app.db  =  mongojs( 'appstore_test', ['bots'], {connectionTimeout: 3000} );
    server.app.db = mongojs('mongodb://localhost:27017/appstore_test')

    // server.app.db = mongojs('nonexistentdb', ['a']);

    // server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/apps/4ed2b809d7446b9a0e000014',
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


  lab.test('tries to update an app that does not exist', (done) => {
    var server = new Hapi.Server()
    server.connection();
    server.app.db = mongojs('appstore_test');
    server.register(apps, (err) => {
      expect(err).to.not.exist()
      var options = {
        method: 'PATCH',
        url: '/apps/4ed2b809d7446b9a0e000015',
        payload: {
          title : "4th. App, maybe",
          description : "You have to be serious",
          provider : "CS is for Computer Science",
          appUrl : "http://4thapp.com"
        }
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

})


// lab.experiment('Apps module', () => {
//
//     var resultId; // Initialize a variable to save the document ID later.
//
//     lab.test('should create an app', (done) => {
//         var options = {
//             method: 'POST',
//             url: '/apps',
//             payload: {
//               title : "1. App",
//               description : "Whatever",
//               provider : "God himself",
//               appUrl : "http://1app.com"
//             }
//         };
//
//         server.inject(options, (response) => {
//           Code.expect(response.statusCode).to.equal(201);
//           done();
//         });
//     });

    // lab.test('should delete user', (done) => {
    //     var options = {
    //         method: 'DELETE',
    //         url: '/api/v1/users/' + resultId // Turns out resultId is undefined
    //     };
    //
    //     server.inject(options, (response) => {
    //         Code.expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });

// });

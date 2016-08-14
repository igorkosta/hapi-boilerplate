// apps.js
var id = require('pow-mongodb-fixtures').createObjectId;

var apps = exports.apps = {
    app1: {
        _id: id(),
        title: "1. App",
        description: "First ever app",
        provider: "God himself",
        appUrl: "http://1app.com",
        type: "mobile",
        category: "finance",
        created: Date(),
        client_id: "36b9294cdf396757",
        client_secret: "a3e42b1657c52345c3a78d827eebf1e0"
    },
    app2: {
      _id: id(),
      title: "2. App",
      description: "2nd app",
      provider: "Jesus",
      appUrl: "http://2app.com",
      type: "desktop",
      category: "finance",
      created: Date(),
      client_id: "78bd710fc235f52b",
      client_secret: "34908fba207fcfb4912ca2c0bceb3b1b"
    },
    app3: {
      _id: id('4ed2b809d7446b9a0e000014'),
      title: "3. App",
      description: "3rd and last app",
      provider: "Judas",
      appUrl: "http://3app.com",
      type: "mobile",
      category: "finance",
      created: Date(),
      client_id: "445787f3a5ce038b",
      client_secret: "8b6950fc70af9ddaef33e8b72d0c247d"
    }
}

var db = require("../models");

module.exports = function(app) {
  // Find all Logins and return them to the user with res.json
  app.get("/api/login", function(req, res) {
    db.Login.findAll({}).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });

  app.get("/api/login/:id", function(req, res) {
    // Find one Login with the id in req.params.id and return them to the user with res.json
    db.Login.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });

  app.post("/api/login", function(req, res) {
    // Create an Login with the data available to us in req.body
    console.log(req.body);
    db.Login.create(req.body).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });

  app.put("/api/login", function(req, res) {
    db.Login.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });

  app.delete("/api/login/:id", function(req, res) {
    // Delete the Login with the id available to us in req.params.id
    db.Login.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });

};

// *********************************************************************************
// event-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the Event
  app.get("/api/event", function(req, res) {
    var query = {};
    if (req.query.login_id) {
      query.LoginId = req.query.login_id;
    }
    db.Event.findAll({
      where: query
    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  // Get route for retrieving a single Event
  app.get("/api/event/:id", function(req, res) {
    db.Event.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbEvent) {
      console.log(dbEvent);
      res.json(dbEvent);
    });
  });

  // POST route for saving a new Event
  app.post("/api/event", function(req, res) {
    db.Event.create(req.body).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  // DELETE route for deleting Event
  app.delete("/api/event/:id", function(req, res) {
    db.Event.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  // PUT route for updating Event
  app.put("/api/event", function(req, res) {
    db.Event.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });
};

var db = require("../models");

module.exports = function (app) {
  // Use to find all Events stored in Customer table
  app.get("/api/customer", function (req, res) {
    db.Customer.findAll({}).then(function (dbCustomer) {
      res.json(dbCustomer);
      //res.render("name of html file", dbCustomer);
    });
  });

  // Used to find all events for a Customers Email stored in Customer table
  app.get("/api/customer/:email", function (req, res) {
    console.log("get: customer email: " + req.params.email);
    db.Customer.findAll({
      where: {
        email: req.params.email
      }
    }).then(function (dbCustomer) {
      console.log(`dbcustomer after get by email`, dbCustomer);
      res.json(dbCustomer);
      //res.render("name of html file", dbCustomer);
    });
  });

  // Used to add new Event for a Customer in Customer table
  app.post("/api/customer", function (req, res) {
    console.log(req.body);
    db.Customer.create(req.body).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });

  // Used if you need to update an Event for a Customer in Customer table
  app.put("/api/customer", function (req, res) {
    console.log("put: customer id: " + req.body.id);
    db.Customer.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbCustomer) {
        res.json(dbCustomer);
      });
  });

  // Used to delete an Event for a Customer in Customer table
  app.delete("/api/customer/:id", function (req, res) {
    console.log("delete: customer id: " + req.params.id);
    db.Customer.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbCustomer) {
      res.json(dbCustomer);
    });
  });

};

let db = require("../models");
// let express = require("express");
// let app = express.Router();

console.log(`in api-routes`);
// Create routes and set up logic within those routes where required.

// "/"  set up home page with header and all burgers that are devoured and not devoured
module.exports = function (app) {



app.get("/api/login/:email", function(req, res) {
    // Find one Login with the id in req.params.id and return them to the user with res.json
    db.Login.findAll({
      where: {
        email: req.params.email
      }
    }).then(function(dbLogin) {
      res.json(dbLogin);
    });
  });
}


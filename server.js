let express = require("express");

let app = express();

// Set the port of the application
// process.env.PORT lets the port be set by Heroku
let PORT = process.env.PORT || 8080;

let db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// let routes = require("./routes/api-routes.js")(app);

// app.use(routes);
require("./routes/login-api-routes.js")(app);
//require("./routes/events-api-routes.js")(app);
require("./routes/html-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

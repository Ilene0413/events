// *********************************************************************************
// event-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var axios = require("axios");
var api_key = "s9c04c83kvavxsruk7iy25wm";

function formulateResponse(events, venues) {
  var resArr = [];
  for (var i = 0; i < events.length; i++) {
    for (var j = 0; j < venues.length; j++) {
      if (venues[j].VenueId == events[i].VenueId) {
        var resObj = {
          event: events[i],
          venueName: venues[j].Name
        };
        resArr.push(resObj);
      }
    }
  }

  return resArr;
}

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the Event from LTD API
  app.get("/api/event", function (req, res) {
    var URL = "https://api.londontheatredirect.com/rest/v2/Events";
    axios
      .get(URL, {
        headers: { 'apiKey': api_key }
      })
      .then(function (eventResponse) {
        console.log("total events = " + eventResponse.data.Events.length);
        var venueURL = "https://api.londontheatredirect.com/rest/v2/Venues";
        axios
          .get(venueURL, {
            headers: { 'apiKey': api_key }
          })
          .then(function (venueResponse) {
            console.log("total venue = " + venueResponse.data.Venues.length);
            var responseArray = formulateResponse(eventResponse.data.Events, venueResponse.data.Venues);
            res.json(responseArray);
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an object that comes back with details pertaining to the error that occurred.
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  });

  // Get route for retrieving details of a single venue
  app.get("/api/event/:VenueId", function (req, res) {
    console.log("get: venueId: " + req.params.VenueId);
    var URL = "https://api.londontheatredirect.com/rest/v2/Venues/" + req.params.VenueId;
    axios
      .get(URL, {
        headers: { 'apiKey': api_key }
      })
      .then(function (eventResponse) {
        console.log("venue name = " + eventResponse.data.Venue.Name);
        res.json(eventResponse.data.Venue);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  });

};

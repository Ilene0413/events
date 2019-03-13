// *********************************************************************************
// event-api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var axios = require("axios");
require("dotenv").config();

var api_key = process.env.LTD_API_KEY;

const eventLimit = 50;

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

function filterEventsByDate(date, events) {
  var newEventArr = [];
  for (var i = 0; i < events.length; i++) {
    // need to check startDate or endDate is Null
    if (events[i].StartDate == null && events[i].EndDate == null) {
      newEventArr.push(events[i]);
    }
    else if (events[i].StartDate == null && date <= events[i].EndDate) {
      newEventArr.push(events[i]);
    }
    else if (date >= events[i].StartDate && events[i].EndDate == null) {
      newEventArr.push(events[i]);
    }
    else if (date >= events[i].StartDate && date <= events[i].EndDate) {
      newEventArr.push(events[i]);
    }
  }

  return newEventArr;
}

function limitEventsResults(numEvents, events) {
  var newEventArr = [];
  if (numEvents >= events.length) {
    return events;
  }
  
  for (var i=0; i<numEvents; i++) {
    newEventArr.push(events[i]);
  }

  return newEventArr;
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
            var newEventArr = limitEventsResults(eventLimit, eventResponse.data.Events);
            console.log("get filtered event list length = " + newEventArr.length);
            var responseArray = formulateResponse(newEventArr, venueResponse.data.Venues);
            res.json(responseArray);
            //res.render("name of html file", responseArray);
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

  // GET route for getting all of the Event from LTD API within a given date
  app.get("/api/event/date/:date", function (req, res) {
    console.log("get event date " + req.params.date);
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
            var newEventArr = filterEventsByDate(req.params.date, eventResponse.data.Events);
            console.log("get event date newEventArr length = " + newEventArr.length);
            var responseArray = formulateResponse(newEventArr, venueResponse.data.Venues);
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

  // Get route for retrieving details of a single event
  app.get("/api/event/:eventId", function (req, res) {
    console.log("get: eventId: " + req.params.eventId);
    var URL = "https://api.londontheatredirect.com/rest/v2/Events/" + req.params.eventId;
    axios
      .get(URL, {
        headers: { 'apiKey': api_key }
      })
      .then(function (eventResponse) {
        console.log("event name = " + eventResponse.data.Event.Name);
        res.json(eventResponse.data.Event);
        //res.render("name of html file", eventResponse.data.Event);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          res.send(404);
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

  app.get("/api/event/venue/:venueId", function (req, res) {
    console.log("get: venueId: " + req.params.venueId);
    var URL = "https://api.londontheatredirect.com/rest/v2/Venues/" + req.params.venueId;

    axios
      .get(URL, {
        headers: { 'apiKey': api_key }
      })
      .then(function (eventResponse) {
        console.log("venue name = " + eventResponse.data.Venue.Name);
        res.json(eventResponse.data.Venue);
        //res.render("name of html file", eventResponse.data.Venue);
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

let state = {
    validform: true,
    customer: {
        first_name: "",
        last_name: "",
        email: "",
    }
};

$(document).ready(function () {
    console.log(`document ready`);
    // following code is obtainin user information when submit button is clicked
    $(".rowSignin").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        state.customer.first_name = $("#first").val().trim(),
        state.customer.last_name = $("#last").val().trim(),
        state.customer.email = $("#email").val().trim(),

            // validate that all information was entered
            validateUser(state.customer);

        //if entries are valid - send get request to api/customer to get user information
        //api/customer should return a json file with the events saved and purchased by the user
        // Send the GET request.
        if (!state.validform) {
            return;
        };
        eventsPage(state.customer);
    });
    //following code is for when the saved button is selected
    //format the data for the database
    $("#eventInfo").on("click", "#saved", function (event) {
        event.preventDefault();

        console.log(`in save button`);
        let formatEventDate = $("#datepicker").val();
       

        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 1,
            venueName: "",
            eventDate: moment(formatEventDate).format(),
            eventId: $("#eventNum").val(),
            eventName: "",
            saved: false,
            purchased: true,
            numPurchased: $("#people").val(),
        }

        postFavorite(customerEvent);
    });

    //following code is for when the purchased button is selected
    //format the data for the database

    $("#eventInfo").on("click", "#purchased", function (event) {
        event.preventDefault();

        console.log(`in purchase button`);
        let formatEventDate = $("#datepicker").val();
        // if (formatEventDate == "Invalid date") {
        //     return;
        // };
        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 0,
            venueName: "",
            eventDate: moment(formatEventDate).format(),
            eventId: $("#eventNum").val(),
            eventName: "",
            saved: false,
            purchased: true,
            numPurchased: $("#people").val(),
        };
        postFavorite(customerEvent);
    });
});

//this function validates the user information that was entered

function validateUser(customer) {
    state.validform = true;
    //this checks if all items were not entered,otherwise send back to user
    if (customer.fname == "" &&
        customer.lname == "" &&
        customer.email == ""
    ) {
        state.valdiform = false;
        return state.validform;
    }
}
function eventsPage(customerData) {
    //make call to api to get the events and format to put on events page
    $.ajax(`/api/event/`, {
        type: "GET"
    }).then(function (response) {
        renderEventsPage(response, customerData);
    })
        .catch(function (error) {
            console.log(`error getting event info ${error}`);
        });
}
//this function will create the events page

function renderEventsPage(eventInfo, customerData) {
    // start by formatting table and column with events
    let eventDiv = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Select Events</th>
                    <th scope="col">Saved Events</th>
                </tr>
            </thead>
            <tbody>
                <tr>
        `;

    let eventClose = `</tr></tbody></table>`;
    let eventData = `<td><div id="eventData">`;
    if (eventInfo.length > 0) {
        for (let i = 0; i < eventInfo.length; i++) {
            let event = `<h2> ${[eventInfo[i].event.EventId]}.   ${eventInfo[i].event.Name}</h2> <br>`;
            let description = `<p> ${eventInfo[i].event.Description}</p> <br>`;
          let eventPicture = `<img src="${eventInfo[i].event.MainImageUrl}">`;
            eventData += event + eventPicture + description
        };

        eventData += '</div></td>';
        eventDiv += eventData;
    };

    //format column 2

    let col2Div = `
        <td>
            <div>
                <form>
                    <div class="form-group">
                        <input id="eventNum" placeholder="Enter event number" type="number" min="1">
                        <br>
                        <select class="form-control" id="people" >
                            <option selected># of people</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <br>
                        <input id="datepicker" width="276" placeholder="Select date">
                        <br><br>
                        <button class="btn btn-lg btn-primary" id="saved">Save</button>
                        <button class="btn btn-lg btn-primary" id="purchased">Purchase</button>
                    </div>
                </form>
            </div>
        </td>
        <td id="customerInfo"></td>
        `;
    eventDiv += col2Div + eventClose;
    $(".rowSignin").empty();
    $("#eventInfo").html(eventDiv);


    //this function will load the events a user has already saved or purchased 
    $.ajax(`/api/customer/${customerData.email}`, {
        type: "GET",
        data: customerData
    }).then(function (response) {
        // reload page with theaters available and saved/purchased events
        let prepend = false;
        renderCustInfo(response, prepend);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });

}

function renderCustInfo(customerInfo, prepend) {
    let customerDiv = `<div id="saved-purchased">`;
    // check that the customer has saved or purchased events
    let venueName, eventName, eventDate;
    if (customerInfo.length > 0) {
        for (let i = 0; i < customerInfo.length; i++) {
            if (customerInfo[i].saved) {
                let sp = `<p>Saved</p>`;
                let numPeople = "";
            }
            else {
                sp = sp = `<p>Purchased</p>`;
                numPeople = `<p>${customerInfo[i].numPurchased} People</p>`;

            };
            eventName = `<p>${customerInfo[i].eventName}</p>`;
            venueName = `<p>${customerInfo[i].venueName}</p>`;
            eventDate = `<p>${moment(customerInfo[i].eventDate).format("LL")}</p>`;
            customerDiv += sp + eventName + venueName + eventDate + numPeople;
        };
        customerDiv += '</div>';
    };
    if (prepend) {
        console.log(`venue ${venueName}, eventDate ${eventDate}`);
        $("#saved-purchased").prepend(eventName + eventDate + numPeople + sp);
        $("#datepicker").val("");
        $("#eventNum").val("");
        $("#people").val("");

    } else {
        $("#customerInfo").html(customerDiv);
    };
}

//this function posts the users saved and purchased events in the database

function postFavorite(customerEvent) {
    //get the name of venue from api
    console.log(`eventid ${customerEvent.eventId}`);
    $.ajax(`/api/event/${customerEvent.eventId}`, {
        type: "GET"
    }).then(function (response) {
        console.log(`in event details ${JSON.stringify(response)}`);
        customerEvent.eventName = response.Name;
        postData(customerEvent);
    })
        .catch(function (error) {
            console.log(`error getting event info ${error}`);
        });
}

function postData(customerEvent) {
    console.log(`in post favorites ${customerEvent.eventName}`);
    // Send the POST request.
    console.log(`post favorite ${JSON.stringify(customerEvent)}`);

    $.ajax("/api/customer", {
        type: "POST",
        data: customerEvent
    }).then(
        function (response) {
            // Reload the page to get the updated list
            console.log(`in post favorite`, response);
            let prepend = true;
            renderCustInfo([response], prepend);
        })
        .catch(function (error) {
            console.log(`error message in post favorite ${error}`);
            return;
        });

}


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
            console.log(`first name ${state.customer.first_name}, ${state.customer.last_name}, email ${state.customer.email}`)
        validateUser(state.customer);

        //if entries are valid - send get request to api/login to get user information
        //api/login should return a json file with the excursions saved and purchased by the user
        // Send the GET request.
        if (!state.validform) {
            return;
        }
        eventsPage(state.customer);
    });
    // $("#eventInfo").on("click", ".eventPics", function () {
    //     event.preventDefault();
    //     console.log(`in event`);
    //     // get value of theater clicked to determine which theater to get additional info for using venue id number
    //     //send info to server to retrieve using longdon theater api
    //     // let theaterValue = $(this).data("value");
    //     console.log($(this));
    //     let eventValue = $(this).children('img').attr("value");
    //     console.log(`theater value ${eventValue}`);
    //     //put in code to server to get description of theater
    // });


    //following code is for when the saved button is selected
    $("#eventInfo").on("click", "#saved", function (event) {
        event.preventDefault();

        console.log(`in save button`);
        let formatEventDate = $("#datepicker").val();

        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 1,
            eventDate:moment(formatEventDate).format(),
            eventId: $("#eventNum").val(),
            saved: true,
            purchased: false,
            numPurchased: $("#people").val(),
        }
        console.log(`saved ${JSON.stringify(customerEvent)}`);
        postFavorite(customerEvent);
    });

    //following code is for when the purchased button is selected
    $("#eventInfo").on("click", "#purchased", function (event) {
        event.preventDefault();

        console.log(`in purchase button`);
        //        let id = $(this).data("id");
        let formatEventDate = $("#datepicker").val();
        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 1,
            eventDate: moment(formatEventDate).format(),
            eventId: $("#eventNum").val(),
            saved: false,
            purchased: true,
            numPurchased: $("#people").val(),
        }

        postFavorite(customerEvent);
    });
});

//this function validates tht user information was entered

function validateUser(customer) {
    state.validform = true;
    //this checks if all items were not entered, send back to user
    if (customer.fname == "" &&
        customer.lname == "" &&
        customer.email == "" &&
        customer.password == "") {
        state.valdiform = false;
        return state.validform;
    }
}
function eventsPage(customerData) {
    //make call to api to get the events and format to put on events page
    $.ajax(`/api/event/`, {
        type: "GET"
    }).then(function (response) {
        console.log(response[0]);
        console.log(`response data ${response[0].event.MainImageUrl}`)
        console.log(response[0].event.SmallImageUrl);
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

    let eventClose = `</tr></tbody></table>`
    let eventData = `<td><div id="eventData">`
    console.log(`in redner events page ${eventInfo[0].event.MainImageUrl}`);
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


    //this function will load the avaiable events along with the 
    //users prior save/purchased requests
    //put out purchased and saved data for user if any
    //render html page
    $.ajax(`/api/customer/${customerData.email}`, {
        type: "GET",
        data: customerData
    }).then(function (response) {
        // reload page with theaters available and saved/purchased events
        // may need to render or else use handlebars
        console.log(JSON.stringify(response));
        renderCustInfo(response);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });

}

function renderCustInfo(customerInfo, prepend=false) {
    // console.log(`in render customer ${customerInfo.venueId}`);
    // $.ajax(`/api/event/${customerInfo.venueId}`, {
    //     type: "GET",
    // }).then(function (response) {
        let customerDiv = `<div id="saved-purchased">`;
        // check that the customer has saved or purchased events
        let venue, eventDate;
        if (customerInfo.length > 0) {
            for (let i = 0; i < customerInfo.length; i++) {
//                let venue = `<p>${customerInfo[i].venueId}</p>`;
                venue = `<p>${customerInfo[i].venueId}</p>`;
                eventDate = `<p>${moment(customerInfo[i].eventDate).format("LL")}</p>`;
                customerDiv += venue + eventDate;
            };
            customerDiv += '</div>';
        };
        if (prepend) {
            $("#saved-purchased").prepend(venue + eventDate);
        } else {
            $("#customerInfo").html(customerDiv);
        }
    
    // })
    //     .catch(function (error) {
    //         console.log(`error getting customer info ${error}`);
    //     });



}
function postFavorite(customerEvent) {
    // let postData = {
    //     eventid: customerEvent.eventId,
    //     numPeople: customerEvent.numPeople,
    //     eventDate: customerEvent.eventDate,
    //     favorite: customerEvent.favorite
    // };

    // Send the POST request.
    console.log(`post favorite ${JSON.stringify(customerEvent)}`);

    $.ajax("/api/customer", {
        type: "POST",
        data: customerEvent
    }).then(
        function (response) {
            // Reload the page to get the updated list
            console.log(`in post favorite`, response);
            renderCustInfo([response], true)
        }
    )
        .catch(function (error) {
            console.log(`error message in post favorite ${error}`);
            return;
        })
}


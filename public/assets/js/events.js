let state = {
    validform: true,
    msg: "",
    dateError:"",
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
    // let eventDiv = `
    //     <table class="table">
    //         <thead>
    //             <tr>
    //                 <th scope="col">Event</th>
    //                 <th scope="col">Select Events</th>
    //                 <th scope="col">Saved Events</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             <tr>
    //     `;

    // let eventClose = `</tr></tbody></table>`;
    // let eventData = `<td><div id="eventData">`;
    // if (eventInfo.length > 0) {
    //     for (let i = 0; i < eventInfo.length; i++) {
    //         let event = `<h2> ${[eventInfo[i].event.EventId]}.   ${eventInfo[i].event.Name}</h2> <br>`;
    //         let description = `<p> ${eventInfo[i].event.Description}</p> <br>`;
    //         let eventPicture = `<img src="${eventInfo[i].event.MainImageUrl}">`;
    //         eventData += event + eventPicture + description
    //     };

    //     eventData += '</div></td>';
    //     eventDiv += eventData;
    // };
    let eventDiv = `
    <div >
    <ul class="list-group">
    `;
    let eventClose = '</ul>'
    let panes = '<div class="tab-content">'
    let eventData = '<li class="list-group-item list-group-flush" role="tablist">'
    if (eventInfo.length > 0) {

        let bottle = '<div class="d-flex w-100 justify-content-between">'
        let bottlecap = '</div>'
        let closer = '</a>'
        for (let i = 0; i < eventInfo.length; i++) {

            let opener = `<a  
            class="list-group-item list-group-item-action flex-column align-items-start" 
            id="list-${[eventInfo[i].event.EventId]}-list"
            data-toggle="list"
            href"#list-${[eventInfo[i].event.EventId]}"
            role="tab"
            aria-controls="${[eventInfo[i].event.EventId]}" 
            data-anijs="if: click, do: $toggleClass invisible">`

            let event = `<h5 class"mb-1">${eventInfo[i].event.Name}</h5>`;

            let eId = `<span class="badge badge-info">${[eventInfo[i].event.EventId]}</span>`

            let poster = eventInfo[i].event.MainImageUrl

            let eventPicture = `<img src="${poster}" height="250" value="${eventInfo[i].event.EventId}">`;

            let description = `<p> ${eventInfo[i].event.TagLine}</p> <br>`;

            let paneTab = `<div 
            class="tab-pane fade" 
            id="list-${[eventInfo[i].event.EventId]}" 
            role="tabpanel" 
            aria-labelledby="list-${[eventInfo[i].event.EventId]}-list">
            <p>${eventInfo[i].event.Description}</p>
            </div>`

            eventData += opener + bottle + event + eId + bottlecap + eventPicture + closer + description
            panes += paneTab
        };
        panes += closer
        eventData += '</li>'
        eventDiv += eventData;
    };
    eventDiv += eventClose;
    //format column 2

    let col2Div = `
            <div>
                <form name="customerForm">
                    <div class="form-group">
                        <input id="eventNum" placeholder="Enter event number" type="number" min="1">
                        <div id="errorMsg">${state.msg}</div>
                        <br>
                        <select class="form-control" id="people" >
                            <option value=" "># of people</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <br>
                        <input type="date" id="datepicker" width="276" placeholder="Select date" required>
                        <div id="dateError">${state.dateError}</div>
                        <br><br>
                        <button class="btn btn-lg btn-primary" id="saved">Save</button>
                        <button class="btn btn-lg btn-primary" id="purchased">Purchase</button>
                    </div>
                </form>
            </div>
        `;
    //eventDiv += col2Div + eventClose;

    let pageHead = `
        <div class="jumbotron">
            <div class="container">
                <div class="row">
                    <div id="showListings" class="col-6">Event</div>
                    <div id="userWindow" class="col-4">Select Events</div>
                    <div id="customerInfo"class="col-2">Saved Events</div>
                </div>
            </div>
        </div>
      `;

    $(".rowSignin").empty();
    $(".rowCarousel").empty();
    $("#eventInfo").html(pageHead);
    $("#userWindow").append(col2Div);
    $("#userWindow").append(panes);
    $("#showListings").append(eventDiv);

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
        if (response === 404) {
            state.msg = "invalid event entered";
        }
        else {
            state.msg = "";
            customerEvent.eventName = response.Name;
            postData(customerEvent);
        };
        // customerEvent.eventName = response.Name;
        // postData(customerEvent);

    })
        .catch(function (error) {
            console.log(`error getting event info ${JSON.stringify(error)}`);
            if (error.status === 404) {
                state.msg = "invalid event entered";
                $("#errorMsg").append(state.msg);
            }
            else {
                state.msg = "";
                customerEvent.eventName = response.Name;
                postData(customerEvent);
            };

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
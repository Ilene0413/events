

let state = {
    validform: true
};

$(document).ready(function () {
    console.log(`document ready`);
    // following code is obtainin user information when submit button is clicked
    $(".rowSignin").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        let customer = {
            first_name: $("#first").val().trim(),
            last_name: $("#last").val().trim(),
            email: $("#email").val().trim(),
        };
        // validate that all information was entered
        console.log(`first name ${customer.first_name}, ${customer.last_name}, email ${customer.email}`)
        validateUser(customer);

        //if entries are valid - send get request to api/login to get user information
        //api/login should return a json file with the excursions saved and purchased by the user
        // Send the GET request.
        if (!state.validform) {
            return;
        }
        eventsPage(customer);
    });
    $("#eventInfo").on("click", ".eventPics", function () {
        event.preventDefault();
        console.log(`in event`);
        // get value of theater clicked to determine which theater to get additional info for using venue id number
        //send info to server to retrieve using longdon theater api
        // let theaterValue = $(this).data("value");
        console.log($(this));
        let eventValue = $(this).children('img').attr("value");
        console.log(`theater value ${eventValue}`);
        //put in code to server to get description of theater
    });


    //following code is for when the saved button is selected
    $("#saved").on("click", function (event) {
        console.log(`in save button`);
        //    let id = $(this).children('id').attr("");
        let id = $("#eventNum").val().trim();
        console.log(`eventnumber ${id}`);
        postFavorite(id, saved);
    });

    //following code is for when the purchased button is selected
    $("#purchased").on("click", function (event) {
        console.log(`in purchase button`);
        //        let id = $(this).data("id");
        let id = $("#eventNum").val().trim();
        let purchased = true;
        postFavorite(id, purchased);
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
        console.log(`obtained event info`);
        console.log(JSON.stringify(response));
        renderEventsPage(response, customerData);
        //    renderEventInfo();
        //  getCustomerInfo(customerData);
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
    if (eventInfo.length > 0) {
        for (let i = 0; i < eventInfo.length; i++) {
            let event = `<h2> ${[eventInfo[i].event.EventId]}.   ${eventInfo[i].event.Name}</h2> <br>`;
            let description = `<p> ${eventInfo[i].event.Description}</p> <br>`;
            let picture = "https://media.londontheatredirect.com/Event/TheLionKing/event-list-image_15037.jpg";
            let eventPicture = `<img src="${picture}" value="${eventInfo[i].event.EventId}">`;
            //         let eventPicture = $(`<img src="${eventInfo[i].event.MainImageUrl}>"`);
            console.log(`event ${JSON.stringify(event)}, description ${JSON.stringify(description)}`);
            //        console.log(`event picture ${JSON.stringify(eventPicture)}`)
            eventData += event + eventPicture + description
            // eventDiv.append(eventPicture).append(event).append(description)
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
                        <button class="btn btn-lg btn-primary" id="saved">Save</button>
                        <button class="btn btn-lg btn-primary" id="purchased" >Purchase</button>
                        <br><br>
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
        renderCustInfo(response);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });

}

function renderCustInfo(customerInfo) {
    //    let customerDiv = $(`<td>
    let customerDiv = `<div id="saved-purchased">`;
    // check that the customer has saved or purchased events
    if (customerInfo.length > 0) {
        for (let i = 0; i < customerInfo.length; i++) {
            let venue = `<p>${customerInfo[i].venueId}</p>`;
            let eventDate = `<p>${customerInfo[i].eventDate}</p>`;
            customerDiv += venue + eventDate;
        };
        customerDiv += '</div>';
    };
    $("#customerInfo").html(customerDiv);

}
function postFavorite(id, favorite) {
    let postData = {
        id: id,
        favorite: favorite
    };
    // Send the PUT request.
    $.ajax("/api/customer", {
        type: "PUT",
        data: postData
    }).then(
        function () {
            // Reload the page to get the updated list
            location.reload();
        }
    )
        .catch(function (error) {
            console.log(`error message in post favorite ${error}`);
            return;
        })
}


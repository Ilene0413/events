let state = {
    validform: true,
    msg: "",
    dateError: "",
    peopleError: "",
    customer: {
        first_name: "",
        last_name: "",
        email: "",
    },
};

$(document).ready(function () {
    console.log(`document ready`);
    // following code is obtaining user information when submit button is clicked
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
        let customerDate = moment(formatEventDate, 'YYYY-MM-DD', true);
        let isValid = customerDate.isValid();
        if (!isValid) {
            state.dateError = "please enter date";
            $("#dateError").append(state.dateError);
            return;
        }

        else {

            state.dateError = "";
        };

        if (!isValid) {
            state.dateError = "please enter date";
            $("#dateError").append(state.dateError);
            return;
        }
        else {
            state.dateError = "";
        };
        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 1,
            venueName: "",
            eventDate: moment(formatEventDate).format(),
           // eventId: $("#eventNum").val(),
            eventId: $(".show").attr( "id").substring(5),
            eventName: "",
            saved: true,
            purchased: false,
            numPurchased: $("#people").val(),
        }

        postFavorite(customerEvent);
    });

    //following code is for when the purchased button is selected
    //format the data for the database

    $("#eventInfo").on("click", "#purchased", function (event) {
        event.preventDefault();



        //check that a valid date has been entered
        let formatEventDate = $("#datepicker").val();
        let customerDate = moment(formatEventDate, 'YYYY-MM-DD', true);
        let isValid = customerDate.isValid();
        if (!isValid) {
            state.dateError = "please enter date";
            $("#dateError").append(state.dateError);
            return;
        }

        else {
            state.dateError = "";
        };

        // check that a ticket is being purchased for at least one person
        console.log(`number of people ${$("#people").val()}`);

        if ($("#people").val() === " ") {
            state.peopleError = "Please enter number of tickets to purchase"
            $("#peopleError").append(state.peopleError);
            return;
        }
        else {
            state.peopleError = "";
        };

        let customerEvent = {
            first: state.customer.first_name,
            last: state.customer.last_name,
            email: state.customer.email,
            venueId: 0,
            venueName: "",
            eventDate: moment(formatEventDate).format(),
           // eventId: $("#eventNum").val(),
            eventId: $(".show").attr( "id").substring(5),
            eventName: "",
            saved: false,
            purchased: true,
            numPurchased: $("#people").val(),
        };
        postFavorite(customerEvent);
    });
    // this code is used when the customer wants to delete a saved item

    $("#eventInfo").on("click", "#deletedButton", function (event) {
        event.preventDefault();

        console.log(`in delete button`);
        //get customer id

        let id = $(this).attr("value");
        let custEmail = $(this).attr("custEmail");
        console.log(`id ${id} email ${custEmail}`);
        deleteSavedEvent(id, custEmail);
    });

    //this code is run when the customer wants to purchase a saved item
    $("#eventInfo").on("click", "#purchasedBtn", function (event) {
        event.preventDefault();

        console.log(`in purchase button`);
        //get customer id
        let id = $(this).attr("value");
        let custEmail = $(this).attr("custEmail");
        console.log(`id ${id} email ${custEmail}`);
        purchaseEvent(id, custEmail);
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
    let panes = `<div><div id="p-frame" class="tab-content">`
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
            href="#list-${[eventInfo[i].event.EventId]}"
            role="tab"
            aria-controls="${[eventInfo[i].event.EventId]}" 
            data-anijs="if: click, do: $toggleClass invisible">`

            let event = `<h5 class="mb-1 showTitle">${eventInfo[i].event.Name}</h5>`;

            //let eId = `<h5 class="mb-1 badge badge-info badge-pill">${[eventInfo[i].event.EventId]}</h5>`

            let poster = eventInfo[i].event.MainImageUrl

            let eventPicture = `<img src="${poster}" height="250" value="${eventInfo[i].event.EventId}">`;

            let description = `<div class="mb-1"><p> ${eventInfo[i].event.TagLine}</p> <br></div>`;

            let paneTab = `<div 
            class="tab-pane fade" 
            id="list-${[eventInfo[i].event.EventId]}" 
            role="tabpanel" 
            aria-labelledby="list-${[eventInfo[i].event.EventId]}-list">
            <small>${eventInfo[i].event.Description}</small>
            </div>`

            //eventData += opener + bottle + event + eId + bottlecap + eventPicture + closer + description
            eventData += opener + bottle + event + bottlecap + eventPicture + closer + description
            panes += paneTab
        };
        panes += bottlecap + bottlecap
        eventData += '</li>'
        eventDiv += eventData;
    };
    eventDiv += eventClose;
    //format column 2

                        // pulled from col2Div, kept in case we want or need the typable event back.
                        // <input id="eventNum" placeholder="Enter event number" type="number" min="1">
                        // <div id="errorMsg">${state.msg}</div>
                        // <br></br>
    let col2Div = `
            <div id="formWindow">
                <form name="customerForm">
                    <div class="form-group">
                        <select class="form-control" id="people">
                            <option value=" "># of people</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                        <div id="peopleError">${state.peopleError}</div>
                        <br>
                        <input type="date" id="datepicker" width="276" placeholder="Select date" required>
                        <div id="dateError">${state.dateError}</div>
                        <br><br>
                        <button class="btn btn-sm btn-primary" id="saved">Save</button>
                        <button class="btn btn-sm btn-primary" id="purchased">Purchase</button>
                    </div>
                </form>
            </div>
        `;
    //eventDiv += col2Div + eventClose;

    let pageHead = `
        <div class="jumbotron" id="newpic">
            <div class="container">
                <div class="row">
                    <div class="col-6" id="showListingsParent">
                        <div id="showListings"></div>
                    </div>
                    <div class="col-4" id="userWindowParent">
                        <div id="userWindow"></div>
                    </div>
                    <div class="col-2" id="customerInfoParent">
                        <div id="customerInfo" class="col-2"></div>
                    </div>
                </div>
            </div>
        </div>
      `;

    $(".rowSignin").empty();
    $("#merryGoRound").empty();

    //$("#eventInfo").html(eventDiv);
    getCustomerInfo(customerData.email);


    $("#eventInfo").html(pageHead);
    $("#userWindow").append(col2Div);
    $("#formWindow").append(panes);
    $("#showListings").append(eventDiv);
    $("#showListings, #userWindow, #customerInfo, #p-frame").stick_in_parent();

}
//this function will load the events a user has already saved or purchased 

function getCustomerInfo(custEmail) {
    console.log(`get customerInfo`, custEmail);
    console.log(`/api/customer/${custEmail}`);
    $.ajax(`/api/customer/${custEmail}`, {
        type: "GET",
        data: custEmail
    }).then(function (response) {
        // reload page with theaters available and saved/purchased events
        console.log(`back from get customer info`, response);
        let prepend = false;
        renderCustInfo(response, prepend);
    }).catch(function (error) {
        console.log(`error getting customer info ${error}`);
    });


}
//This function renders the customers saved and purchased items

function renderCustInfo(customerInfo, prepend) {
    let customerDiv = `<div id="saved-purchased">`;
    // check that the customer has saved or purchased events
    console.log(customerInfo)
    let sp, venueName, eventName, eventDate, numPeople, customerButton;
    if (customerInfo.length > 0) {
        let cardtop = '<div class="card mb-1" style="width: 180px;"><div class="card-body">'

        for (let i = 0; i < customerInfo.length; i++) {
            if (customerInfo[i].saved) {

                sp = `<small>Saved </small>`;
                console.log(`customer id ${customerInfo[i].id}`);
                console.log(`customer id ${customerInfo[i].email}`);

                numPeople = "";
                customerButton = `<br><button class="btn btn-sm btn-info" id="purchasedBtn" value="${customerInfo[i].id}" custEmail=${customerInfo[i].email}>Purchase</button><br>
                <br><button class="btn btn-sm btn-info" id="deletedButton" value="${customerInfo[i].id}" custEmail=${customerInfo[i].email}">Remove</button>`;

            }
            else {
                sp = sp = `<small>Purchased </small>`;
                if (customerInfo[i].numPurchased < 2) {
                    numPeople = `<small class="card-text">${customerInfo[i].numPurchased} Ticket</small><br>`;
                }else{
                    numPeople = `<small class="card-text">${customerInfo[i].numPurchased} Tickets</small><br>`;
                }
                customerButton = "";
            };
            eventName = `<h5 class="card-title">${customerInfo[i].eventName}</h5>`;
            venueName = `<small>${customerInfo[i].venueName}</small>`;
            eventDate = `<h6 class="card-subtitle mb-2 text-muted">${moment(customerInfo[i].eventDate).format("LL")}</h6>`;
            customerDiv += cardtop + eventName + eventDate + sp + numPeople + venueName + customerButton + `</div></div>`; 

        };
        customerDiv += '</div>';
    };
    if (prepend) {
        console.log(`venue ${venueName}, eventDate ${eventDate}`);
        let cardtop = '<div class="card mb-1" style="width: 180px;"><div class="card-body">'
        //JohnM
        //$("#saved-purchased").prepend(cardtop + eventName + eventDate + numPeople + sp + `</div></div>`);


        $("#saved-purchased").prepend(cardtop + eventName + eventDate + sp + numPeople + venueName + customerButton + `</div></div>`);
        $("#datepicker").val("");
        $("#eventNum").val("");
        $("#people").val(" ");

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

// This function posts data to the database
function postData(customerEvent) {
    console.log(`in post favorites ${customerEvent.eventName}`);
    // Send the POST request.
    console.log(customerEvent)
    // clear out error messages 
    $("#dateError").empty();
    $("#peopleError").empty();

    $.ajax("/api/customer", {
        type: "POST",
        data: customerEvent
    }).then(
        function (response) {
            // Reload the page to get the updated list
            let prepend = true;
            renderCustInfo([response], prepend);
        })
        .catch(function (error) {
            console.log(`error message in post favorite ${error}`);
            return;
        });

}

//this function deletes items from the database that the user no longer wants to save
function deleteSavedEvent(id, custEmail) {
    $.ajax(`/api/customer/${id}`, {
        type: "DELETE"
    }).then(function (response) {
        console.log(`back from delete`, response, custEmail);
        // reload page with theaters available and saved/purchased events
        getCustomerInfo(custEmail);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });

}
//this function will update the database if a user wants to purchase a saved item
function purchaseEvent(id, custEmail) {
    $.ajax(`/api/customer/${id}`, {
        type: "UPDATE"
    }).then(function (response) {
        console.log(`purcahese`, response, custEmail);
        // reload page with theaters available and saved/purchased events
        getCustomerInfo(custEmail);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });


}
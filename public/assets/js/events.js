

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
        console.log(`first name ${customer.first - name}, ${customer.last_name}, email ${customer.email}`)
        validateUser(customer);

        //if entries are valid - send get request to api/login to get user information
        //api/login should return a json file with the excursions saved and purchased by the user
        // Send the GET request.
        if (!state.validform) {
            return;
        }
        loadEvents(customer);
    });
    $("#theatreValues").on("click", ".theatrepics", function () {
        event.preventDefault();
        console.log(`in theater`);
        // get value of theater clicked to determine which theater to get additional info for using venue id number
        //send info to server to retrieve using longdon theater api
        // let theaterValue = $(this).data("value");
        console.log($(this));
        let theaterValue = $(this).children('img').attr("value");
        console.log(`theater value ${theaterValue}`);
        //put in code to server to get description of theater
    });


    //following code is for when the saved button is selected
    $(".save").on("click", function (event) {
        let id = $(this).data("id");
        let saved = true;
        postFavorite(id, saved);
    });

    //following code is for when the purchased button is selected
    $(".purchase").on("click", function (event) {
        let id = $(this).data("id");
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
//this function will load the avaiable events along with the 
//users prior save/purchased requests
function loadEvents(customerData) {
    //put out purchased and saved data for user if any
    //render html page
    console.log(`in load events`);
    $.ajax(`/api/login/${customerData.email}`, {
        type: "GET",
        data: customer
    }).then(function (results) {
        // reload page with theaters available and saved/purchased events
        // may need to render or else use handlebars
        let hbsObject = {
            description: "Select a Venue",
            savedPurchased: results
          };
          res.render("index", hbsObject);
    })
        .catch(function (error) {
            console.log(`error getting customer info ${error}`);
        });

};


function postFavorite(id, favorite) {
    let postData = {
        id: id,
        favorite: favorite
    };
    // Send the PUT request.
    $.ajax("/api/excursions", {
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


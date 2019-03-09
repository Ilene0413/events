///where and how are we storing the excursions
//if db server has to send back along with customer saved, purchased info
//are we storing them in an array and the server only sends back if saved or purchased
//don't want api call because possible will get back different excursions which we don't want
//may be able to use api for excursion data information by storing in db or array excursion id from api


//Consumer Key	tiqvnQLlKUgkc8ATrPbK1myLZ5exZLRJ
//Consumer Secret	0fRTTQKdMd40NryB

//meet up api key 364674692e442c75c26e5d406d2a11

$(document).ready(function () {

    let state = {
        validform: true
    };
    // following code is obtainin user information when submit button is clicked
    $(".row-signin").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        let customer = {
            first_name: $("#first").val().trim(),
            last_name: $("#last").val.trim(),
            email: $("#email").val.trim(),
        };
        // validate that all information was entered
        console.log(`first name ${customer.first-name}, ${customer.last_name}, email ${customer.email}`)
        validateUser(customer);

        //if entries are valid - send get request to api/login to get user information
        //api/login should return a json file with the excursions saved and purchased by the user
        // Send the GET request.
        if (state.validform) {
            $.ajax("/api/login", {
                type: "POST",
                data: customer
            }).then(function (results) {
                // reload page with excursions available and saved/purchased excursions
                loadExcursions(results);
    //            location.reload();
            })
                .catch(function (error) {
                    console.log(`error getting customer info ${error}`);
                });
        }
        else {
            return;
        };
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


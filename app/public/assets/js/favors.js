//=================================================
// Functions
//=================================================

// adds new favor to the list

function addFavor() {
    var newFavor = {
        favor_name: $("#newFavorName").val().trim(),
        favor_desc: $("#newFavorDesc").val().trim(),
        favor_price: $("#newFavorPrice").val().trim(),
        favor_datetime: $("#calendarSection").val().trim()
    }

    // Send the POST request.
    $.ajax("/api/favor/new", {
        type: "POST",
        data: newFavor
    }).then(
        function () {
            // Reload the page to get the updated list
            location.reload();
        });
}

//=================================================
// On Page Load
//=================================================
$(document).ready(function () {
    //========================================================================
    // Binding flatpicker to the form so the calendar and date selector pop up
    //========================================================================
    flatpickr("#calendarSection", {
        altInput: true,
        enableTime: true,
        dateFormat: "F j, Y h:i K",
        minDate: "today",
        maxDate: new Date().fp_incr(365)
    });
    // ========================================================================
    // When the submit button is clicked, a new row is added to the database
    // ========================================================================
    $(document).on('click', '#submitBtn', function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        addFavor();
    });
});
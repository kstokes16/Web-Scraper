$.getJSON("/stories", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#stories").append("<div><h5 data-id='" + data[i]._id + "'>" +  data[i].title + "<br />" +  'https://www.alligator.org' + data[i].link + "</h5></div>");
    }
  });

// functionality for click of article
$(document).on("click", "h5", function() {
  $("#notes").empty();
  console.log("jquery working.");
  var thisID = $(this).attr("data-id");

  // AJAX call
  $.ajax({
    method: "GET",
    url: "/stories/" + thisID
  })

  // after AJAX, dynamically add info to the page
  .then(function(data) {
    console.log(data);
    // Append the title of the article to the page
    $("#notes").append
    ("<h3>Add a note to this story below</h3>" + "<h4>" + data.title + "</h4>");

    // Append an input to enter a new note
    $("#notes").append("<input id='titleinput' name='title' >" + "<br> <br>");

    // A button to submit a new note, with the ID of the article saved to it
    $("#notes").append("<button type='button' class='btn btn-success' data-id='" + data._id + "' id='savenote'>Save Note</button>");

    if (data.note) {
      $("#titleinput").val
      (data.note.title);
      // Place body of note in the body text area
      $("#bodyinput").val
      (data.note.body);
    }
  });
});

// Save note button functionality
$(document).on("click", "#savenote", function () {
  // Pull in id with that article
  var thisID = $(this).attr("data-id");

  // Post request to update the note
  $.ajax({
    method: "POST",
    url: "/stories/" + thisID,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  // If AJAX is successful,
  .then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  // Remove all the values entered by the user
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
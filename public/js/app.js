$.getJSON("/stories", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#stories").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });

// functionality for click of article
$(document).on("click", "p", function() {
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
    ("<h2>" + data.title + "</h2");

    // Append an input to enter a new title
    $("#notes").append("<input id='titleinput' name='title' >");

    // A button to submit a new note, with the ID of the article saved to it
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

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
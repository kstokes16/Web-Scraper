$.getJSON("/stories", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#stories").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });

$(document).on("click", "p", function() {
  $("#notes").empty();
  console.log("jquery working.");
  let thisID = $(this).attr("data-id");

  // AJAX call
  $.ajax({
    method: "GET",
    url: "/stories/" + thisID
  })
});
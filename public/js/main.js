$(document).ready(function() {
  if ( location.pathname.split("/")[1] == "visualization" ) {
    $('#d3Link').addClass('active');
  }
  if ( location.pathname.split("/")[1] == "c3visualization" ) {
    $('#c3Link').addClass('active');
  }
  if ( location.pathname.split("/")[1] == "account" ) {
    $('#homeLink').addClass('active');
  }
});
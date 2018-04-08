$(".button-collapse").sideNav();

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 2, // Creates a dropdown of 15 years to control year,
  today:'Tomorrow',
  clear: 'Clear',
  close: 'Ok',
  min:+1, //makes tomorrow as the minimum possible date
  closeOnSelect: true // Close upon selecting a date,
});

// $('.timepicker').pickatime({
//   default: 'now', // Set default time: 'now', '1:30AM', '16:30'
//   fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
//   twelvehour: false, // Use AM/PM or 24-hour format
//   donetext: 'OK', // text for done-button
//   cleartext: 'Clear', // text for clear-button
//   canceltext: 'Cancel', // Text for cancel-button
//   autoclose: false, // automatic close timepicker
//   ampmclickable: true, // make AM PM clickable
//   aftershow: function(){} //Function for after opening timepicker
// });


$(document).ready(function() {
  $('select').material_select();
});

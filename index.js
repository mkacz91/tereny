$(function() {
  var mapKey = getParam('key')
  $.getScript("https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap")
})

function getParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

var map
var gder;
function initMap() {
  map = new google.maps.Map($("#map")[0],
  {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  })
  gder = new google.maps.Geocoder()

  var query = {'address': "Konigsberger Str. 2, 26810 Westoverledingen"}
  gder.geocode(query, function(result, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(result[0].geometry.location)
    } else {
      alert("Geocode failed: " + status)
    }
  })
}

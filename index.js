
$(function() {
  gapiKey = getParam('key');
  if (gapiKey === null) {
    console.error("Google API key not provided");
    return;
  }
  sheetId = getParam('sheet');
  if (sheetId === null) {
    console.error("Sheet ID not provided");
    return;
  }
  loadMapsApi();
})

var gapiKey;
var sheetId;

function allApisLoaded() {
  console.log("Apis ready");

  gapi.client.sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    key: gapiKey
  }).then(function(response) {
      console.log(response);
  });

  initMap();
}

function getParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results === null)
    return null;
	return results[1] || 0;
}

function apiLoaded() {
  if (!window.pendingApiCount)
    window.pendingApiCount = 2;
  if (window.pendingApiCount <= 0) {
    console.error("pendingApiCount decremented below 0");
    return;
  }
  if (--window.pendingApiCount == 0)
    allApisLoaded();
}

function loadMapsApi() {
  $.getScript('https://maps.googleapis.com/maps/api/js?key=' + gapiKey + '&callback=apiLoaded');
}

function loadSheetsApi() {
  gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(apiLoaded);
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

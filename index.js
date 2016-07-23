
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
  origin = getParam('origin');
  if (origin === null) {
    console.error("Origin not provided");
    return;
  }
  origin = origin.split(';').map(parseFloat);
  if (origin.length != 2) {
    console.error("Invalid origin format");
    return;
  }

  loadMapsApi();
})

var gapiKey;
var sheetId;
var origin;
var gmap;

function allApisLoaded() {
  origin = new google.maps.LatLng(origin[0], origin[1]);

  gmap = new google.maps.Map($('#map')[0],
  {
    center: origin,
    zoom: 15
  });
  new google.maps.Marker({
    map: gmap,
    position: origin,
    label: 'S'
  });

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Adresy!A2:C10',
    key: gapiKey
  }).then(function(response) {
    var gder = new google.maps.Geocoder();
    var values = response.result.values;
    for (var i = 0; i < values.length; ++i) {
      gder.geocode({
        address: values[i].join() + ",DE"
      }, function(result, status) {
        var loc = result[0].geometry.location;
        new google.maps.Marker({
          map: gmap,
          position: loc,
          draggable: true
        });
      });
    }
  }, function(reason) {
    var error = reason.result.error;
    console.error("Unable to load sheet: (" + error.code + ") " + error.message);
  });
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

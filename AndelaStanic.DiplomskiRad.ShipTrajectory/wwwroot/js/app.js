$(document).ready(function () {

	map.on('click', function (e) {
		searchRadius(e.latlng);

	});

	showShipTrajectories();

	

});

function showShipTrajectoriesRaw() {
	$.get("shipraw/trajectories", function (response) {
		var ships = response.data;

		var lastPosition = null;

		for (var i = 0; i < ships.length; i++) {
			var ship = ships[i];

			var polylinePoints = [];

			for (var j = 0; j < ship.positions.length; j++) {

				var position = ship.positions[j];

				if (j === 0) {
					L.marker([position.longitude, position.latitude]).addTo(map).bindTooltip(ship.shipName);  
                }			

				polylinePoints[j] = [position.longitude, position.latitude];

				lastPosition = position;
			}

			L.polyline(polylinePoints, { color: 'green', dashArray: '5, 5', dashOffset: '0' }).addTo(map).bindTooltip(ship.name);     
		}

		map.setView(new L.LatLng(lastPosition.longitude, lastPosition.latitude), 13);
	});

}

function showShipTrajectories() {
	$.get("ship/trajectories", function (response) {
		showResponse(response);
	});

}

function getColor(shipType) {
	switch (shipType) {
		case 'Military':
			return 'green';
			break;
		case 'SAR':
			return 'red';
			break;
		case 'Fising':
			return 'yellow';
			break;
		case 'Sailing':
			return 'purple';
			break;
		case 'Towing':
			return 'orange';
			break;
		case 'Other':
			return 'brown';
			break;
		default: 
			return 'blue';
			break;
    }
}

function searchRadius(latlng) {

	var circle = L.circle([latlng.lat, latlng.lng], {
		radius: 1000
	}).addTo(map);

	$.get("ship/searchradius",
		{
			lat: latlng.lat,
			lng: latlng.lng
		})
		.done(function (response) {
			showResponse(response);
		});

}

function showResponse(response) {
	var ships = response.data;

	for (var i = 0; i < ships.length; i++) {
		var ship = ships[i];

		var geojsonFeature = {
			"type": "Feature",
			"properties": {
				"name": ship.shipName,
				"shipType": ship.shipType,
				"popupContent": ship.shipName + '(' + ship.shipType + ')'
			},
			"geometry": JSON.parse(ship.geometry)
		};

		L.geoJSON(geojsonFeature, { color: getColor(ship.shipType), dashArray: '5, 5', dashOffset: '0' }).addTo(map).bindTooltip(geojsonFeature.properties.popupContent);
	}
}
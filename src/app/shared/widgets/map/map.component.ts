// angular
import { Component, Input, OnInit } from '@angular/core';

// app
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
	@Input() style = 'mapbox://styles/mapbox/streets-v11';
	@Input() mapCoordinates = [-96, 37.8];
	@Input() markers;

	public map: mapboxgl.Map;
	public markersList = [];

	ngOnInit() {
		(mapboxgl as any).accessToken = environment.mapBox.accessToken;
		this.map = new mapboxgl.Map({
			container: 'ham-map',
			style: this.style,
			zoom: 1,
			center: [this.mapCoordinates[0], this.mapCoordinates[1]]
		});

		// Add map controls
		this.map.addControl(new mapboxgl.NavigationControl());

		// add markers to map
		// add popup to each marker
		this.markers.features.forEach((marker) => {
			this.markersList.push(
				new mapboxgl.Marker()
					.setLngLat({
						lng: marker.geometry.coordinates[0],
						lat: marker.geometry.coordinates[1]
					})
					.setPopup(
						new mapboxgl.Popup({offset: 2}) // add popups
							.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>')
					)
					.addTo(this.map)
			);
		});

		// update map
		this.map.on('load', () => this.map.resize());
	}

	/**
	 * remove a marker
	 *
	 * @param marker
	 */
	public onClickRemoveMarkers(marker: any) {
		marker.remove();
	}
}

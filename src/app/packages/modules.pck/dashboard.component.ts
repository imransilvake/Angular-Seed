// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
	public geoJson = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-77.032, 38.913]
				},
				properties: {
					title: 'Mapbox',
					description: 'Washington, D.C.'
				}
			},
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-122.414, 37.776]
				},
				properties: {
					title: 'Mapbox',
					description: 'San Francisco, California'
				}
			}]
	};
}

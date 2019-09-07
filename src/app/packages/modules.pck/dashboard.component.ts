// angular
import { Component } from '@angular/core';

// app
import { faCalendarAlt, faChartLine, faCheck, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
	public faIcons = [faChartLine, faUsers, faCalendarAlt, faCheck, faTimes];
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

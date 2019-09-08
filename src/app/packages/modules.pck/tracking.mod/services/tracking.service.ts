// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class TrackingService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	/**
	 * fetch realtime map data
	 */
	public fetchRealtimeMapData() {
		return of(
			{
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
			}
		)
	}
}

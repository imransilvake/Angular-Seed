// angular
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { delay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { SidebarService } from '../../../packages/frame.pck/services/sidebar.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
	@Input() style = 'mapbox://styles/mapbox/streets-v11';
	@Input() mapCoordinates = [-96, 37.8];
	@Input() markers;

	public map: mapboxgl.Map;
	public markersList = [];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _sidebarService: SidebarService) {
	}

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

		// listen: sidebar toggle
		this._sidebarService.sidebarToggle
			.pipe(
				takeUntil(this._ngUnSubscribe),
				delay(350)
			)
			.subscribe(() => this.map.resize());
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
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

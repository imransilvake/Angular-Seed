// angular
import { Component } from '@angular/core';

// app
import TableData from '../../../../../../assets/dummy/table-data';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss']
})

export class ClientComponent {
	public data = TableData;
}

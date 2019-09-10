// angular
import { Component } from '@angular/core';

// app
import { faCalendarAlt, faMobileAlt, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
	public faIcons = [faUser, faUsers, faCalendarAlt, faUsers, faMobileAlt, faMobileAlt];
}

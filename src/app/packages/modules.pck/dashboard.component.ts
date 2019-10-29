// angular
import { Component } from '@angular/core';

// app
import { faCalendarAlt, faMobileAlt, faMoneyBillAlt, faUserAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
	public faIcons = [faMoneyBillAlt, faCalendarAlt, faUsers, faMobileAlt, faMobileAlt, faUserAlt];
}

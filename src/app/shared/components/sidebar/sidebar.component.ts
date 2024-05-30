import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

/**
 * SideBarComponent is responsible for displaying the sidebar navigation menu.
 * It initializes the menu items used for navigation within the application.
 */

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent implements OnInit {

	menuItems: MenuItem[];

	/**
	 * Initializes the component and sets up the sidebar menu items.
	 *
	 * @returns {void}
	 */
	ngOnInit() {
		this.menuItems = [
			{
				label: 'Ontology',
				icon: 'pi pi-folder',
				routerLink: '/ontology'
			},
			{
				label: 'Data',
				icon: 'pi pi-file',
				routerLink: '/data'
			},
			{
				label: 'Mappings',
				icon: 'pi pi-list',
				routerLink: '/mappings'
			}
		];
	}

}

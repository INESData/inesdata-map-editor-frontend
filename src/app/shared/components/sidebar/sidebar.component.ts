import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SideBarComponent implements OnInit {

	menuItems: MenuItem[];

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

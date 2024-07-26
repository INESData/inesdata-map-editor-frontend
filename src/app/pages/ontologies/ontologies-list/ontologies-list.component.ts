import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './../ontologies.component.html'
})

export class OntologiesListComponent {
	ontologies = [];

	visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
}

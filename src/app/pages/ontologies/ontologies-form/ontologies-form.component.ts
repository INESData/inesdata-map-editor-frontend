import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './../ontologies.component.html'
})

export class OntologiesFormComponent {
	ontologies = [];

	visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
}

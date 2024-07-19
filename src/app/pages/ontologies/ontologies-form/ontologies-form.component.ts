import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './../ontologies.component.html'
})

export class OntologiesFormComponent {
	ontologies = [
    { id: 1, name: 'Ontology 1', description: 'Descripción de la Ontología 1' },
    { id: 2, name: 'Ontology 2', description: 'Descripción de la Ontología 2' },
    { id: 3, name: 'Ontology 3', description: 'Descripción de la Ontología 3' }
  ];
}

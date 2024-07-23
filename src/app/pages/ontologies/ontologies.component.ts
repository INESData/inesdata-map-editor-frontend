import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies',
	templateUrl: './ontologies.component.html',
	styleUrls: []
})
export class OntologiesComponent {
	ontologies = [
    { nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' },
		{ nombre: 'Education', titulo: 'Te example ontology', url: 'https://w3id.org/example', autor: 'Juan Carlos Pérez Bolsón', version: '17 . 13', fecha: '30 / 04 / 2024' }
  ];
	visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
}

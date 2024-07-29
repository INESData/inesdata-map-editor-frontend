import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './ontologies-list.component.html'
})
export class OntologiesListComponent {
	ontologies = [
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		},
		{
			nombre: 'Education',
			titulo: 'The example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17.13',
			fecha: '30/04/2024'
		}
	];
	visible: boolean = false;

	showDialog() {
		this.visible = true;
	}
}

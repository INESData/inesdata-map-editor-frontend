import { Component } from '@angular/core';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './ontologies-list.component.html'
})
export class OntologiesListComponent {
	ontologies = [
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		},
		{
			nombre: 'Education',
			titulo: 'Te example ontology',
			url: 'https://w3id.org/example',
			autor: 'Juan Carlos Pérez Bolsón',
			version: '17 . 13',
			fecha: '30 / 04 / 2024'
		}
	];
	addDialogVisible: boolean = false;
	deleteDialogVisible: boolean = false;

	showDialog() {
		this.addDialogVisible = true;
	}

	showDialogDelete() {
		this.deleteDialogVisible = true;
	}
}

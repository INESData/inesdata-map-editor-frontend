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
			nombre: 'Healthcare',
			titulo: 'Health Ontology',
			url: 'https://w3id.org/health',
			autor: 'Ana María González',
			version: '1.0',
			fecha: '12/01/2022'
		},
		{
			nombre: 'Finance',
			titulo: 'Financial Transactions Ontology',
			url: 'https://w3id.org/finance',
			autor: 'Carlos Fernández',
			version: '3.2',
			fecha: '23/03/2023'
		},
		{
			nombre: 'Agriculture',
			titulo: 'Agricultural Practices Ontology',
			url: 'https://w3id.org/agriculture',
			autor: 'Laura Martínez',
			version: '5.4',
			fecha: '15/07/2023'
		},
		{
			nombre: 'Transport',
			titulo: 'Transport Systems Ontology',
			url: 'https://w3id.org/transport',
			autor: 'Miguel Torres',
			version: '2.1',
			fecha: '18/09/2021'
		},
		{
			nombre: 'Retail',
			titulo: 'Retail Management Ontology',
			url: 'https://w3id.org/retail',
			autor: 'Elena Rodríguez',
			version: '4.7',
			fecha: '30/11/2022'
		},
		{
			nombre: 'Tourism',
			titulo: 'Tourism Information Ontology',
			url: 'https://w3id.org/tourism',
			autor: 'Roberto Sánchez',
			version: '6.3',
			fecha: '20/05/2024'
		},
		{
			nombre: 'Energy',
			titulo: 'Energy Resources Ontology',
			url: 'https://w3id.org/energy',
			autor: 'Patricia Ruiz',
			version: '8.2',
			fecha: '05/08/2023'
		},
		{
			nombre: 'Real Estate',
			titulo: 'Real Estate Ontology',
			url: 'https://w3id.org/realestate',
			autor: 'José Herrera',
			version: '9.5',
			fecha: '14/02/2022'
		},
		{
			nombre: 'Environment',
			titulo: 'Environmental Impact Ontology',
			url: 'https://w3id.org/environment',
			autor: 'María López',
			version: '11.7',
			fecha: '30/06/2023'
		}
	];
	visible: boolean = false;

	showDialog() {
		this.visible = true;
	}
}

import { Component } from '@angular/core';

@Component({
	selector: 'app-mappings-list',
	templateUrl: './mappings-list.component.html'
})
export class MappingsListComponent {
	mappings = [
		{ name: 'name', ontology: 'Ontología', datasource: 'Fuente de datos' },
		{ name: 'name', ontology: 'Ontología', datasource: 'Fuente de datos' },
		{ name: 'name', ontology: 'Ontología', datasource: 'Fuente de datos' }
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

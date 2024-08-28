import { Component } from '@angular/core';

@Component({
	selector: 'app-mappings-list',
	templateUrl: './mappings-list.component.html'
})
export class MappingsListComponent {
	mappings = [
		{
			name: 'name',
			ontology: 'Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología',
			datasource: 'Fuente de datos | Fuente de datos'
		},
		{ name: 'name', ontology: 'Ontología', datasource: 'Fuente de datos' },
		{ name: 'name', ontology: 'Ontología | Ontología | Ontología', datasource: 'Fuente de datos' }
	];
	addDialogVisible = false;
	deleteDialogVisible = false;

	showDialog() {
		this.addDialogVisible = true;
	}

	showDialogDelete() {
		this.deleteDialogVisible = true;
	}
}

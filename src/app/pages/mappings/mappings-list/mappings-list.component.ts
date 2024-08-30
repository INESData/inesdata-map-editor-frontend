import { Component } from '@angular/core';

@Component({
	selector: 'app-mappings-list',
	templateUrl: './mappings-list.component.html'
})
export class MappingsListComponent {
	selectedCategories: unknown[] = [];
	mappings = [
		{
			name: 'name',
			ontology:
				'Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología | Ontología',
			datasource: 'Fuente de datos | Fuente de datos'
		},
		{ name: 'name', ontology: 'Ontología', datasource: 'Fuente de datos' },
		{ name: 'name', ontology: 'Ontología | Ontología | Ontología', datasource: 'Fuente de datos' }
	];
	addDialogVisible: boolean = false;
	deleteDialogVisible: boolean = false;
	autoDialogVisible: boolean = false;

	showDialog() {
		this.addDialogVisible = true;
	}

	showDialogDelete() {
		this.deleteDialogVisible = true;
	}

	showDialogAuto() {
		this.autoDialogVisible = true;
	}

	categories: unknown[] = [
		{ name: 'Test 1', key: 'A' },
		{ name: 'Test 2', key: 'M' },
		{ name: 'Test 3', key: 'P' },
		{ name: 'Test 4', key: 'R' }
	];
}

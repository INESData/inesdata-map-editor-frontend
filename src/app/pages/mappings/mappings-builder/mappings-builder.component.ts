import { Component } from '@angular/core';

interface Formato {
	name: string;
	code: string;
}

interface Mapping {
	ontology: string;
	database: string;
}

@Component({
	selector: 'app-mappings-builder',
	templateUrl: './mappings-builder.component.html'
})
export class MappingsBuilderComponent {
	formatos: Formato[];
	mappings: Mapping[];
	selectedFormato: Formato;

	constructor() {
		this.formatos = [
			{ name: 'CSV', code: 'A' },
			{ name: 'PostgreSQL', code: 'B' }
		];
		this.mappings = [
			{ ontology: 'ontology1', database: 'database' },
			{ ontology: 'ontology2', database: 'database' }
		];
	}

	selectedCategory: any = null;

	categories: any[] = [
		{ name: 'education', key: 'A' },
		{ name: 'ontology2', key: 'M' }
	];

	ngOnInit() {
		this.selectedCategory = this.categories[1];
	}
}

import { Component, OnInit } from '@angular/core';

interface Format {
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
export class MappingsBuilderComponent implements OnInit {
	formats: Format[];
	mappings: Mapping[];
	selectedFormat: Format;
	queryDialogVisible: boolean = false;
	elementDialogVisible: boolean = false;

	constructor() {
		this.formats = [
			{ name: 'CSV', code: 'A' },
			{ name: 'PostgreSQL', code: 'B' }
		];
		this.mappings = [
			{ ontology: 'ontology1', database: 'database' },
			{ ontology: 'ontology2', database: 'database' }
		];
	}

	selectedCategory: unknown = null;

	categories: unknown[] = [
		{ name: 'education', key: 'A' },
		{ name: 'ontology2', key: 'M' }
	];

	showDialogQuery() {
		this.queryDialogVisible = true;
	}

	showDialogElement() {
		this.elementDialogVisible = true;
	}

	ngOnInit() {
		this.selectedCategory = this.categories[1];
	}
}

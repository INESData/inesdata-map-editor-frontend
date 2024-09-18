import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';

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
	destroyRef = inject(DestroyRef);

	formats: Format[];
	mappings: Mapping[];
	selectedFormat: Format;
	ontologies: SearchOntologyDTO[];
	classes: string[];
	attributes: string[];
	queryDialogVisible = false;
	elementDialogVisible = false;

	constructor(private ontologyService: OntologyService) {
		this.formats = [
			{ name: 'CSV', code: 'A' },
			{ name: 'PostgreSQL', code: 'B' }
		];
		this.mappings = [
			{ ontology: 'ontology1', database: 'database' },
			{ ontology: 'ontology2', database: 'database' }
		];
	}

	selectedOntology: SearchOntologyDTO = null;
	selectedCategory: string;
	selectedClass: string[] = null;
	selectedAttribute: string[] = null;

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
		this.getOntologies();
	}

	/**
	 * Gets the list of ontologies.
	 */
	getOntologies(): void {
		this.ontologyService
			.getOntologies()
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: SearchOntologyDTO[]) => {
				this.ontologies = data ?? [];
			});
	}

	/**
	 * Gets the classes of the selected ontology.
	 */
	getClasses(id: number): void {
		this.ontologyService
			.getOntologyClasses(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.classes = data ?? [];
			})
	}

	/**
	 * Gets the attributes of the selected ontology class.
	 */
	getAttributes(id: number, className: string): void {
		this.ontologyService
			.getOntologyAttributes(id, className)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.attributes = data ?? [];
			})
	}

	/**
	 * Gets the selected ontology class
	 */
	onOntologySelect(ontology: SearchOntologyDTO): void {
		this.selectedClass = null;
		this.selectedAttribute = null;
		this.attributes = null;
		this.getClasses(ontology.id);
	}

	/**
	 * Gets the selected ontology class attributes
	 */
	onClassSelect(className: string): void {
		this.selectedAttribute = null;
		this.attributes = null;
		this.getAttributes(this.selectedOntology.id, className);

	}
}

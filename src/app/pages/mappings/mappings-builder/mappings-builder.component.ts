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
	atributtes: string[];
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
	selectedClass: string[] = null;
	selectedAtributte: string[] = null;

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
		//this.selectedOntology = this.categories[1];
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
	 * Gets the atributtes of the selected ontology class.
	 */
	getAtributtes(id: number, className: string): void {
		this.ontologyService
			.getOntologyAtributtes(id, className)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.atributtes = data ?? [];
			})
	}

	/**
	 * Gets the selected ontology class
	 */
	onOntologySelect(ontology: SearchOntologyDTO): void {
		this.selectedClass = null;
		this.selectedAtributte = null;
		this.atributtes = null;
		this.getClasses(ontology.id);
	}

	/**
	 * Gets the selected ontology class atributtes
	 */
	onClassSelect(className: string): void {
		this.selectedAtributte = null;
		this.atributtes = null;
		this.getAtributtes(this.selectedOntology.id, className);

	}
}

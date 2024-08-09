import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OntologyService, PageSearchOntologyDTO, SearchOntologyDTO } from 'projects/mapper-api-client';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ONTOLOGIES_ADD_ONTOLOGY, ONTOLOGIES_EDIT_ONTOLOGY, PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './ontologies-list.component.html'
})
export class OntologiesListComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(
		private ontologyService: OntologyService,
		private languageService: LanguageService
	) {}

	ontologies: SearchOntologyDTO[];
	selectedOntology: SearchOntologyDTO = null;
	header: string = '';
	isEditMode: boolean = false;
	visible: boolean = false;

	/**
	 * Loads the ontologies when the component is initialized
	 */
	ngOnInit(): void {
		this.loadOntologies();
	}

	/**
	 * Shows the dialog for adding/editing an ontology
	 */
	showDialog(ontology?: SearchOntologyDTO): void {
		this.selectedOntology = ontology ? { ...ontology } : null;
		this.isEditMode = !!ontology;
		this.header = ontology
			? this.languageService.translateValue(ONTOLOGIES_EDIT_ONTOLOGY)
			: this.languageService.translateValue(ONTOLOGIES_ADD_ONTOLOGY);
		this.visible = true;
	}

	/**
	 * Loads the ontologies list.
	 */
	loadOntologies(): void {
		this.ontologyService
			.listOntologies(PAGE, SIZE)
			.pipe(
				//TODO: pagination and show success/error popup
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PageSearchOntologyDTO) => {
				this.ontologies = data.content ?? [];
			});
	}

	/**
	 * Delete ontology by its id.
	 */
	deleteOntology(id: number): void {
		this.ontologyService
			.deleteOntology(id)
			.pipe(
				//TODO: action confirmation popup
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.ontologies = this.ontologies.filter((ontology) => ontology.id !== id);
				console.log('Ontology deleted');
			});
	}

	/**
	 * Called when a form is successfully submitted
	 */
	onFormSubmitted() {
		this.visible = false;
		this.loadOntologies();
		this.selectedOntology = null;
	}
}

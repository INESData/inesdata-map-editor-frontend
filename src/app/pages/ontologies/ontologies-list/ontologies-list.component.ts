import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OntologyService, PageSearchOntologyDTO, SearchOntologyDTO } from 'projects/mapper-api-client';
import { catchError, of } from 'rxjs';
import { PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './ontologies-list.component.html'
})
export class OntologiesListComponent implements OnInit {

	destroyRef = inject(DestroyRef);

	constructor(private ontologyService: OntologyService) { }

	ontologies: SearchOntologyDTO[];
	visible: boolean = false;

	/**
	 * Loads the ontologies when the component is initialized
	 */
	ngOnInit(): void {
		this.loadOntologies();
	}

	/**
	 * Loads the ontologies list.
	 */
	loadOntologies(): void {
		this.ontologyService
			.listOntologies(PAGE, SIZE)
			.pipe(
				catchError(error => {
					console.error('Error loading ontologies:', error);
					return of({ content: [] } as PageSearchOntologyDTO);
				}),
				//TODO: pagination and show success/error popup
				takeUntilDestroyed(this.destroyRef))
			.subscribe((data: PageSearchOntologyDTO) => {
				this.ontologies = data.content ?? [];
			});
	}

	/**
	 * Shows the dialog for adding a new ontology
	 */
	showDialog() {
		this.visible = true;
	}
}

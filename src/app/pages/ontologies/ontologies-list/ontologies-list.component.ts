import { Component, OnInit } from '@angular/core';
import { OntologyService, PageSearchOntologyDTO, SearchOntologyDTO } from 'projects/mapper-api-client';
import { catchError, of } from 'rxjs';
import { PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-ontologies-list',
	templateUrl: './ontologies-list.component.html'
})
export class OntologiesListComponent implements OnInit {

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
		this.ontologyService.listOntologies(PAGE, SIZE)
			.pipe(
				//TODO: pagination and show success/error popup
				catchError(error => {
					console.error('Error loading ontologies:', error);
					return of({ content: [] });
				})
			)
			.subscribe((data: PageSearchOntologyDTO) => {
				this.ontologies = data.content;
			});
	}

	/**
	 * Shows the dialog for adding a new ontology
	 */
	showDialog() {
		this.visible = true;
	}
}

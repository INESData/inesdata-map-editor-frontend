import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OntologyDTO, SearchOntologyDTO } from 'projects/mapper-api-client';
import { ontologyDtoForm } from 'projects/mapper-forms/src/public-api';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

import { OntologyService } from '../../../../../projects/mapper-api-client/api/ontology.service';

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './ontologies-form.component.html'
})
export class OntologiesFormComponent implements OnInit, OnChanges {

	destroyRef = inject(DestroyRef);

	@Output() formSubmitted = new EventEmitter<void>();
	@Input() ontology: SearchOntologyDTO;
	@Input() isEditMode: boolean = false;

	file: File;
	ontologyForm: FormGroup = null;

	/**
	 * Constructor
	 * @param fb the form builder
	 */
	constructor(private fb: FormBuilder, private ontologyService: OntologyService) { }

	/**
	 * On component init
	 */
	ngOnInit() {
		this.ontologyForm = createDtoForm(this.fb, ontologyDtoForm);
	}

	/**
	 * Detect changes to the ontology input and updates form
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes.ontology && this.ontologyForm) {
			const ontology = changes.ontology.currentValue;
			ontology ? this.ontologyForm.patchValue(ontology) : this.ontologyForm.reset();
		}
	}

	/**
 * Create new ontology
 */
	addOntology(ontology: OntologyDTO): void {
		ontology.uploadDate = new Date().toISOString();
		this.ontologyService.createOntology(ontology, this.file)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: OntologyDTO) => {
				this.formSubmitted.emit();
				console.log('Ontology created:', data);
			})
	}

	/**
 * Update ontology
 */
	updateOntology(id: number, ontology: OntologyDTO): void {

		this.ontologyService.updateOntology(id, ontology, this.file)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: OntologyDTO) => {
				this.formSubmitted.emit();
				console.log('Ontology updated:', data);
			})
	}

	/**
	* Extract selected file
 */
	onFileSelected(event) {
		this.file = event.target.files[0];
	}

	/**
	 * On form submission
	 */
	onSubmit(): void {
		const ontology: OntologyDTO = this.ontologyForm.value;
		console.info(ontology);

		// TODO: validate

		if (this.isEditMode) {
			this.updateOntology(ontology.id, ontology);
		} else {
			this.addOntology(ontology);
		}
	}
}

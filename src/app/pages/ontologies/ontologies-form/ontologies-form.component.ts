import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OntologyDTO, OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';
import { ontologyDtoForm } from 'projects/mapper-forms/src/public-api';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LABELS_NO_FILE_SELECTED } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './ontologies-form.component.html'
})
export class OntologiesFormComponent implements OnInit {
	destroyRef = inject(DestroyRef);
	fileName: string = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
	fileSelected: boolean = false;

	@Output() formSubmitted = new EventEmitter<void>();
	@Input() isEditMode: boolean = false;

	file: File;
	ontologyForm: FormGroup = null;
	private _ontology: SearchOntologyDTO = null;

	/**
	 * This setter updates the _ontology property
	 * whenever a new value is passed from the parent component.
	 */
	@Input() set ontology(value: SearchOntologyDTO) {
		this._ontology = value;
		if (this.ontologyForm) {
			if (value) {
				this.ontologyForm.patchValue(value);
			} else {
				this.ontologyForm.reset();
			}
		}
	}

	/**
	 * Constructor
	 * @param fb the form builder
	 */
	constructor(
		private fb: FormBuilder, private languageService: LanguageService,
		private ontologyService: OntologyService
	) { }

	/**
	 * On component init
	 */
	ngOnInit() {
		this.ontologyForm = createDtoForm(this.fb, ontologyDtoForm);
	}

	/**
	 * Create new ontology
	 */
	addOntology(ontology: OntologyDTO): void {
		ontology.uploadDate = new Date().toISOString();
		this.ontologyService
			.createOntology(ontology, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((data: OntologyDTO) => {
				this.formSubmitted.emit();
				console.log('Ontology created:', data);
			});
	}

	/**
	 * Update ontology
	 */
	updateOntology(id: number, ontology: OntologyDTO): void {
		this.ontologyService
			.updateOntology(id, ontology, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((data: OntologyDTO) => {
				this.formSubmitted.emit();
				console.log('Ontology updated:', data);
			});
	}

	/**
	 * Extract selected file
	 */
	onFileSelected(event) {
		this.file = event.target.files[0];
		if (this.file) {
			this.fileName = this.file.name;
			this.fileSelected = true;
		} else {
			this.fileName = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
			this.fileSelected = false;
		}
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
		this.ontologyForm.reset();
	}
}

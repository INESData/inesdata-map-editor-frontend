import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OntologyDTO } from 'projects/mapper-api-client';
import { ontologyDtoForm } from 'projects/mapper-forms/src/public-api';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './ontologies-form.component.html'
})
export class OntologiesFormComponent implements OnInit {
	@Output() formSubmitted = new EventEmitter<void>();

	ontologyForm: FormGroup = null;

	/**
	 * Constructor
	 * @param fb the form builder
	 */
	constructor(private fb: FormBuilder) {}

	/**
	 * On component init
	 */
	ngOnInit() {
		this.ontologyForm = createDtoForm(this.fb, ontologyDtoForm);
	}

	/**
	 * On form submission
	 */
	onSubmit(): void {
		const ontology: OntologyDTO = this.ontologyForm.value;
		console.info(ontology);
		// TODO: validate and call the service to save the ontology
		this.formSubmitted.emit();
	}
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OntologyDTO } from 'projects/mapper-api-client';
import { ontologyDtoForm } from 'projects/mapper-forms/src/public-api';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

interface UploadEvent {
	originalEvent: Event;
	files: File[];
}

@Component({
	selector: 'app-ontologies-form',
	templateUrl: './ontologies-form.component.html',
	providers: [MessageService]
})
export class OntologiesFormComponent implements OnInit {
	uploadedFiles: unknown[] = [];
	@Output() formSubmitted = new EventEmitter<void>();

	ontologyForm: FormGroup = null;

	/**
	 * Constructor
	 * @param fb the form builder
	 */
	constructor(
		private fb: FormBuilder,
		private messageService: MessageService
	) {}

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

	onUpload(event: UploadEvent) {
		for (const file of event.files) {
			this.uploadedFiles.push(file);
		}

		this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
	}
}

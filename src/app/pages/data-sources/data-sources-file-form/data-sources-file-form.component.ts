import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LABELS_NO_FILE_SELECTED, MESSAGES_ERRORS_REQUIRED } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-data-sources-file-form',
	templateUrl: './data-sources-file-form.component.html'
})
export class DataSourcesFileFormComponent {
	file: File;
	fileName: string = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
	fileSelected: boolean = false;

	@Input() fileSourceForm: FormGroup = null;
	@Output() fileSelectedEvent: EventEmitter<File> = new EventEmitter<File>();

	constructor(
		private fb: FormBuilder,
		private languageService: LanguageService
	) { }

	/**
	 * Extract selected file
	 */
	onFileSelected(event) {
		this.file = event.target.files[0];
		if (this.file) {
			this.fileName = this.file.name;
			this.fileSelected = true;
			this.fileSelectedEvent.emit(this.file)
		} else {
			this.fileName = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
			this.fileSelected = false;
		}
	}

	/**
	 * Check if a control has validation errors
	 */
	hasError(controlName: string): boolean {
		const control = this.fileSourceForm.get(controlName);
		return control?.invalid && (control?.touched || control?.dirty);
	}

	/**
	 * Get error messages
	 */
	getErrorMessage(controlName: string): string {
		const control = this.fileSourceForm.get(controlName);
		if (control?.errors) {
			if (control.errors.required) {
				return this.languageService.translateValue(MESSAGES_ERRORS_REQUIRED);
			}
		}
		return '';
	}
}

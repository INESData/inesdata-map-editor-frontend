import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/shared/services/language.service';
import { MESSAGES_ERRORS_REQUIRED } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-data-sources-db-form',
	templateUrl: './data-sources-db-form.component.html'
})
export class DataSourcesDbFormComponent {
	@Input() dbSourceForm: FormGroup = null;

	constructor(
		private fb: FormBuilder,
		private languageService: LanguageService
	) {}

	/**
	 * Check if a control has validation errors
	 */
	hasError(controlName: string): boolean {
		const control = this.dbSourceForm.get(controlName);
		return control?.invalid && (control?.touched || control?.dirty);
	}

	/**
	 * Get error messages
	 */
	getErrorMessage(controlName: string): string {
		const control = this.dbSourceForm.get(controlName);
		if (control?.errors) {
			if (control.errors.required) {
				return this.languageService.translateValue(MESSAGES_ERRORS_REQUIRED);
			}
		}
		return '';
	}
}

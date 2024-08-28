import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dataBaseSourceDtoForm } from 'projects/mapper-forms/src/public-api';
import { LanguageService } from 'src/app/shared/services/language.service';
import { MESSAGES_ERRORS_REQUIRED } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-data-sources-db-form',
	templateUrl: './data-sources-db-form.component.html'
})
export class DataSourcesDbFormComponent implements OnInit {

	constructor(private fb: FormBuilder, private languageService: LanguageService) { }
	dbSourceForm: FormGroup = null;

	ngOnInit() {
		this.dbSourceForm = createDtoForm(this.fb, dataBaseSourceDtoForm);

	}

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

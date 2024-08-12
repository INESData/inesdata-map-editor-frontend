import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataSourceDTO, DataSourceService, OntologyDTO } from 'projects/mapper-api-client';
import { dataSourceDtoForm } from 'projects/mapper-forms/src/public-api';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LABELS_NO_FILE_SELECTED } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {

	destroyRef = inject(DestroyRef);


	/**
 * Constructor
 * @param fb the form builder
 */
	constructor(private fb: FormBuilder, private languageService: LanguageService, private dataSourceService: DataSourceService) { }

	dataSourceForm: FormGroup = null;

	dataSourceFormats: string[] = Object.values(DataSourceTypeEnum);
	dataBaseFormats: string[] = Object.values(DataBaseTypeEnum);

	//selectedDataSourceFormat: Format | undefined;
	//selectedDataBase: Format[] | undefined;
	fileName: string = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
	fileSelected: boolean = false;
	file: File;

	showFileFields: boolean = false;
	showDatabaseFields: boolean = false;

	@Output() formSubmitted = new EventEmitter<void>();

	ngOnInit() {
		this.dataSourceForm = createDtoForm(this.fb, dataSourceDtoForm);

		//Subscribe to data source type changes
		this.dataSourceForm.get('type').valueChanges.subscribe((type) => {
			this.updateFormVisibility(type);
		});
	}

	/**
	 * Updates the visibility of form fields based on the selected data source type
	 */
	updateFormVisibility(type: DataSourceTypeEnum): void {
		if (type === DataSourceTypeEnum.FILE) {
			this.showFileFields = true;
			this.showDatabaseFields = false;
		} else if (type === DataSourceTypeEnum.DATABASE) {
			this.showFileFields = false;
			this.showDatabaseFields = true;
		} else {
			this.showFileFields = false;
			this.showDatabaseFields = false;
		}
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
			this.fileName = this.languageService.translateValue(LABELS_NO_FILE_SELECTED)
			this.fileSelected = false;
		}
	}


	/**
	 * Create new data source
	 */
	addDataSource(dataSource: DataSourceDTO): void {
		this.dataSourceService
			.createDataSource(dataSource, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((data: OntologyDTO) => {
				this.formSubmitted.emit();
				console.log('Data source created:', data);
			});
	}

	/**
	 * On form submission
	 */
	onSubmit(): void {
		const dataSource: DataSourceDTO = this.dataSourceForm.value;
		console.info(dataSource);
		//TODO: validate

		this.addDataSource(dataSource);
		// Reset form and visibility after submission
		this.dataSourceForm.reset();
		this.updateFormVisibility(null);
	}
}

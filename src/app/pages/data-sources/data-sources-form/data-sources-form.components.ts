import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataBaseSourceDTO, DataBaseSourceService, DataSourceService, FileSourceDTO, FileSourceService } from 'projects/mapper-api-client';
import { dataBaseSourceDtoForm, dataSourceDtoForm, fileSourceDtoForm } from 'projects/mapper-forms/src/public-api';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_DATA_SOURCES_SUCCESS_CREATED } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(
		private fb: FormBuilder,
		private languageService: LanguageService,
		private dataSourceService: DataSourceService,
		private notificationService: NotificationService,
		private fileSourceService: FileSourceService,
		private dbSourceService: DataBaseSourceService
	) { }

	dataSourceFormats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	dataSourceForm: FormGroup = null;
	selectedDataSourceType: string;
	file: File;

	@Output() formSubmitted = new EventEmitter<void>();
	@Output() dialog = new EventEmitter<void>();
	@Input() isEditMode: boolean = false;

	/**
	 * On component init
	 */
	ngOnInit() {
		this.dataSourceForm = createDtoForm(this.fb, dataSourceDtoForm);
	}

	/**
	 * Create new file source
	 */
	createFileSource(fileSource: FileSourceDTO): void {
		this.fileSourceService
			.createFileSource(fileSource, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_CREATED);
				this.dataSourceForm.reset();
			});
	}
	/**
	 * Create new data base source
	 */
	createDataBaseSource(dbSource: DataBaseSourceDTO): void {
		this.dbSourceService
			.createDataBaseSource(dbSource)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_CREATED);
				this.dataSourceForm.reset();
			});
	}

	/**
	 * Updates the visibility of form fields based on the selected data source type
	 */
	updateFormVisibility(type: string): void {
		// Map the provided type to the corresponding data source type enum
		const dataSourceType = this.mapToDataSource(type);

		// Select the appropriate form group based on the mapped data source type
		const formDto: FormGroup =
			dataSourceType === DataSourceTypeEnum.FILE
				? fileSourceDtoForm
				: dataSourceType === DataSourceTypeEnum.DATABASE
					? dataBaseSourceDtoForm
					: null;

		// Apply the current form values to the selected form group
		formDto.patchValue(this.dataSourceForm.value);
		formDto.get('type').setValue(dataSourceType);
		this.dataSourceForm = createDtoForm(this.fb, formDto);

		if (dataSourceType === DataSourceTypeEnum.FILE) {
			this.dataSourceForm.get('fileType').setValue(type);
		} else if (dataSourceType === DataSourceTypeEnum.DATABASE) {
			this.dataSourceForm.get('databaseType').setValue(type);
		}

		this.selectedDataSourceType = dataSourceType;
	}

	/**
	 * Map database/file type to data source
	 */
	mapToDataSource(type: string): DataSourceTypeEnum {
		if (Object.values(DataBaseTypeEnum).includes(type as DataBaseTypeEnum)) {
			return DataSourceTypeEnum.DATABASE;
		} else if (Object.values(DataFileTypeEnum).includes(type as DataFileTypeEnum)) {
			return DataSourceTypeEnum.FILE;
		}
	}

	/**
	 * Get selected file from child component
	 */
	onFileSelected(file: File) {
		this.file = file;
	}

	/**
	 * On form submission
	 */
	onSubmit(): void {
		// Mark all fields as touched to trigger validation messages
		this.dataSourceForm.markAllAsTouched();

		// Check if the form is valid
		if (this.dataSourceForm.invalid) {
			console.warn('Form is invalid. Please correct the errors before submitting.');
			return;
		}

		// If the form is valid, proceed with the submission
		if (this.selectedDataSourceType === DataSourceTypeEnum.FILE) {
			const fileSource: FileSourceDTO = this.dataSourceForm.value;
			this.isEditMode ? this.fileSourceService.updateFileSource(fileSource.id, fileSource) : this.createFileSource(fileSource);
		} else if (this.selectedDataSourceType === DataSourceTypeEnum.DATABASE) {
			const dbSource: DataBaseSourceDTO = this.dataSourceForm.value;
			this.isEditMode ? this.dbSourceService.updateDataBaseSource(dbSource.id, dbSource) : this.createDataBaseSource(dbSource);
		}
		this.dialog.emit();
	}
}

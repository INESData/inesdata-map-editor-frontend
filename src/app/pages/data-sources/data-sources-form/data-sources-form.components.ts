import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataBaseSourceService, DataSourceDTO, FileSourceService } from 'projects/mapper-api-client';
import { DataBaseSourceDTO } from 'projects/mapper-api-client/model/dataBaseSourceDTO';
import { FileSourceDTO } from 'projects/mapper-api-client/model/fileSourceDTO';
import { dataBaseSourceDtoForm, dataSourceDtoForm, fileSourceDtoForm } from 'projects/mapper-forms/src/public-api';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_DATA_SOURCES_ERRORS_NOFILE, MESSAGES_DATA_SOURCES_SUCCESS_CREATED, MESSAGES_DATA_SOURCES_SUCCESS_UPDATED, MESSAGES_ERRORS } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';

@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(
		private fb: FormBuilder,
		private notificationService: NotificationService,
		private fileSourceService: FileSourceService,
		private dbSourceService: DataBaseSourceService
	) { }

	dataSourceFormats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	dataSourceForm: FormGroup = null;
	selectedDataSourceType: string;
	file: File;
	fileSource: FileSourceDTO;
	dbSource: DataBaseSourceDTO;

	@Output() formSubmitted = new EventEmitter<void>();
	@Input() isEditMode: boolean = false;
	@Input() selectedDataSource: DataSourceDTO;

	/**
	 * On component init
	 */
	ngOnInit() {
		this.dataSourceForm = createDtoForm(this.fb, dataSourceDtoForm);

		//If is edit mode get source data
		if (this.isEditMode) {
			this.getSourceData();
		}
	}

	/**
	 * Get source data depending on whether it is of file or db type
	 */
	getSourceData() {
		if (this.selectedDataSource && this.selectedDataSource.type === DataSourceTypeEnum.FILE) {
			this.getFileSourceData(this.selectedDataSource.id);
		} else if (this.selectedDataSource && this.selectedDataSource.type === DataSourceTypeEnum.DATABASE) {
			this.getDataBaseData(this.selectedDataSource.id)
		}
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
			});
	}

	/**
	 * Update file source
	 */
	updateFileSource(fileSource: FileSourceDTO): void {
		console.log('holi')
		this.fileSourceService
			.updateFileSource(fileSource.id, fileSource)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((data: FileSourceDTO) => {
				console.log(data)
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_UPDATED);
			});
	}

	/**
	 * Update data base source
	 */
	updateDataBaseSource(dbSource: DataBaseSourceDTO): void {
		this.dbSourceService
			.updateDataBaseSource(dbSource.id, dbSource)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_UPDATED);
			});
	}

	/**
	 * Get file source data by its id
	 */
	getFileSourceData(id: number) {
		this.fileSourceService.getFileSource(id)
			.pipe(takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: FileSourceDTO) => {
				this.fileSource = data;
				this.dataSourceForm = createDtoForm(this.fb, fileSourceDtoForm)
				this.dataSourceForm.patchValue(this.fileSource);
				this.selectedDataSourceType = DataSourceTypeEnum.FILE;
			});

	}

	/**
	 * Get data base source data by its id
	 */
	getDataBaseData(id: number) {
		this.dbSourceService.getDataBaseSource(id)
			.pipe(takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: DataBaseSourceDTO) => {
				this.dbSource = data;
				this.dataSourceForm = createDtoForm(this.fb, dataBaseSourceDtoForm)
				this.dataSourceForm.patchValue(this.dbSource);
				this.selectedDataSourceType = DataSourceTypeEnum.DATABASE;
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

		// Check if file is valid
		const isFileSource = this.selectedDataSourceType === DataSourceTypeEnum.FILE;
		if (!this.isEditMode && isFileSource && !this.file) {
			this.notificationService.showErrorMessage(MESSAGES_DATA_SOURCES_ERRORS_NOFILE, MESSAGES_ERRORS);
			return;
		}

		// If the form is valid, proceed with the submission
		const sourceData = this.dataSourceForm.value;
		if (this.selectedDataSourceType === DataSourceTypeEnum.FILE) {
			this.isEditMode ? this.updateFileSource(sourceData) : this.createFileSource(sourceData);
		} else if (this.selectedDataSourceType === DataSourceTypeEnum.DATABASE) {
			this.isEditMode ? this.updateDataBaseSource(sourceData) : this.createDataBaseSource(sourceData);
		}
	}
}

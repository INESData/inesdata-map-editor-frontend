import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataSourceDTO, DataSourceService } from 'projects/mapper-api-client';
import { dataSourceDtoForm } from 'projects/mapper-forms/src/public-api';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DATA_SOURCES_DATA_BASE_TYPE, DATA_SOURCES_FILE_TYPE, LABELS_NO_FILE_SELECTED, MESSAGES_DATA_SOURCES_SUCCESS_CREATED, MESSAGES_DATA_SOURCES_SUCCESS_UPDATED } from 'src/app/shared/utils/app.constants';
import { createDtoForm } from 'src/app/shared/utils/form.utils';


@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {

	destroyRef = inject(DestroyRef);

	constructor(private fb: FormBuilder, private languageService: LanguageService, private dataSourceService: DataSourceService, private notificationService: NotificationService) { }

	dataSourceForm: FormGroup = null;
	dataSourceFormats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];

	file: File;
	fileName: string = this.languageService.translateValue(LABELS_NO_FILE_SELECTED);
	fileSelected: boolean = false;
	showFileFields: boolean = false;
	showDatabaseFields: boolean = false;

	@Output() formSubmitted = new EventEmitter<void>();
	@Input() isEditMode: boolean = false;
	@Output() dialog = new EventEmitter<void>();
	private _dataSource?: DataSourceDTO;

	@Input() set dataSource(value: DataSourceDTO) {
		this._dataSource = value;
		if (!this.dataSourceForm) return;
		if (value) {
			this.dataSourceForm.patchValue(value);
			this.updateFormVisibility(value.type);

			if (value.type === DataSourceTypeEnum.FILE) {
				this.fileName = value.fileName || this.fileName;
				this.fileSelected = !!value.fileName;
			}
		} else {
			this.dataSourceForm.reset();
			this.showFileFields = this.showDatabaseFields = this.fileSelected = false;
			this.fileName = null;
		}

	}

	/**
	 * On component init
	 */
	ngOnInit() {
		this.dataSourceForm = createDtoForm(this.fb, dataSourceDtoForm);

		//Subscribe to data source type changes
		this.dataSourceForm.get('type').valueChanges.subscribe((type) => {
			this.updateFormVisibility(type);
		});
	}

	/**
	 * Create new data source
	 */
	addDataSource(dataSource: DataSourceDTO): void {
		console.log(dataSource)
		this.dataSourceService
			.createDataSource(dataSource, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_CREATED);
				this.dataSourceForm.reset();
			});
	}

	/**
	 * Update data source
	 */
	updateDataSource(id: number, dataSource: DataSourceDTO): void {
		this.dataSourceService
			.updateDataSource(id, dataSource, this.file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.formSubmitted.emit();
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_UPDATED);
				this.dataSourceForm.reset();
			});
	}

	/**
	 * Updates the visibility of form fields based on the selected data source type
	 */
	updateFormVisibility(type: string): void {
		if (!this.isEditMode) {
			type = this.mapToDataSource(type);
		}
		this.showFileFields = type === DataSourceTypeEnum.FILE;
		this.showDatabaseFields = type === DataSourceTypeEnum.DATABASE;

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
	 * On form submission
	 */
	onSubmit(): void {
		const selectedType = this.dataSourceForm.value.type;

		// Assign values if not in edit mode
		const dataSource: DataSourceDTO = this.isEditMode
			? this.dataSourceForm.value
			: {
				...this.dataSourceForm.value,
				type: this.mapToDataSource(selectedType),
				[this.mapToDataSource(selectedType) === DataSourceTypeEnum.DATABASE ? DATA_SOURCES_DATA_BASE_TYPE : DATA_SOURCES_FILE_TYPE]: selectedType,
			};
		this.isEditMode ? this.updateDataSource(dataSource.id, dataSource) : this.addDataSource(dataSource);
		this.dialog.emit();
	}
}

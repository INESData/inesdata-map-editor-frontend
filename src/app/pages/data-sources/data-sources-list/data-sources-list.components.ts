import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataSourceDTO, DataSourceService, PageDataSourceDTO } from 'projects/mapper-api-client';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DATA_SOURCES_ADD_DATA_SOURCE, DATA_SOURCES_EDIT_DATA_SOURCE, MESSAGES_DATA_SOURCES_SUCCESS_DELETED, PAGE, SIZE, SORT_BY_NAME } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-data-sources-list',
	templateUrl: './data-sources-list.component.html'
})
export class DataSourcesListComponent implements OnInit {

	destroyRef = inject(DestroyRef);

	constructor(private dataSourceService: DataSourceService, private languageService: LanguageService, private notificationService: NotificationService) { }

	paginationInfo: PageDataSourceDTO;
	dataSources: DataSourceDTO[];
	selectedDataSource: DataSourceDTO;

	header: string = '';
	isEditMode: boolean = false;
	addDialogVisible: boolean = false;
	deleteDialogVisible: boolean = false;

	/**
	 * Loads the data sources when the component is initialized
	 */
	ngOnInit(): void {
		this.loadDataSources(PAGE, SIZE, SORT_BY_NAME);
	}

	/**
	 * Loads the data sources list.
	 */
	loadDataSources(page: number, size: number, sortBy: string): void {
		this.dataSourceService
			.listDataSources(page, size, sortBy)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PageDataSourceDTO) => {
				this.dataSources = data.content ?? [];
				this.paginationInfo = data;
			});
	}

	/**
	 * Delete data source by its id.
	 */
	deleteDataSource(id: number): void {
		this.dataSourceService
			.deleteDataSource(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.dataSources = this.dataSources.filter((dataSource) => dataSource.id !== id);
				this.notificationService.showSuccess(MESSAGES_DATA_SOURCES_SUCCESS_DELETED)
			});
		this.deleteDialogVisible = false;
	}

	/**
	* Display add/edit dialog
	*/
	showDialog(dataSource?: DataSourceDTO): void {
		this.selectedDataSource = dataSource ? { ...dataSource } : null;
		this.isEditMode = !!dataSource;
		this.header = dataSource ? this.languageService.translateValue(DATA_SOURCES_EDIT_DATA_SOURCE) : this.languageService.translateValue(DATA_SOURCES_ADD_DATA_SOURCE);
		this.addDialogVisible = true;
	}

	/**
	* Display delete dialog
	*/
	showDialogDelete(dataSource: DataSourceDTO): void {
		this.selectedDataSource = dataSource;
		this.deleteDialogVisible = true;
	}

	/**
	* Close delete dialog
	*/
	cancelDelete(): void {
		this.deleteDialogVisible = false;
	}

	/**
	* Method that is called when the page number changes.
	*/
	onPageChange(newPage: number): void {
		this.loadDataSources(newPage, this.paginationInfo.size, SORT_BY_NAME);
	}

	/**
	* Called when a form is successfully submitted
	*/
	onFormSubmitted() {
		this.addDialogVisible = false;
		this.loadDataSources(PAGE, SIZE, SORT_BY_NAME);
		this.selectedDataSource = null;
	}
}

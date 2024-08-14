import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataSourceDTO, DataSourceService, PageDataSourceDTO } from 'projects/mapper-api-client';
import { LanguageService } from 'src/app/shared/services/language.service';
import { DATA_SOURCES_ADD_DATA_SOURCE, DATA_SOURCES_EDIT_DATA_SOURCE, PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-data-sources-list',
	templateUrl: './data-sources-list.component.html'
})
export class DataSourcesListComponent implements OnInit {

	destroyRef = inject(DestroyRef);

	constructor(private dataSourceService: DataSourceService, private languageService: LanguageService) { }

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
		this.loadDataSources();
	}

	/**
	 * Loads the data sources list.
	 */
	loadDataSources(): void {
		this.dataSourceService
			.listDataSources(PAGE, SIZE)
			.pipe(
				//TODO: pagination and show success/error popup
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PageDataSourceDTO) => {
				this.dataSources = data.content ?? [];
			});
	}

	/**
	 * Delete data source by its id.
	 */
	deleteDataSource(id: number): void {
		this.dataSourceService
			.deleteDataSource(id)
			.pipe(
				//TODO: action confirmation popup
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.dataSources = this.dataSources.filter((dataSource) => dataSource.id !== id);
				console.log('Data source deleted');
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
	* Called when a form is successfully submitted
	*/
	onFormSubmitted() {
		this.addDialogVisible = false;
		this.loadDataSources();
		this.selectedDataSource = null;
	}
}

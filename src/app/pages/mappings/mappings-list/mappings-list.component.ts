import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExecutionDTO, ExecutionService, MappingService, PagedModelExecutionDTO, PageSearchMappingDTO } from 'projects/mapper-api-client';
import { SearchMappingDTO } from 'projects/mapper-api-client/model/searchMappingDTO';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_MAPPINGS_SUCCESS_DELETED, PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-mappings-list',
	templateUrl: './mappings-list.component.html'
})
export class MappingsListComponent implements OnInit {

	destroyRef = inject(DestroyRef);

	constructor(private mappingService: MappingService, private notificationService: NotificationService, private executionService: ExecutionService) { }
	selectedCategories: unknown[] = [];
	selectedMapping: SearchMappingDTO;
	mappings: SearchMappingDTO[];
	paginationInfo: PageSearchMappingDTO;
	executionHistory: ExecutionDTO[];
	addDialogVisible = false;
	deleteDialogVisible = false;
	autoDialogVisible = false;

	/**
	 * Loads the mappings when the component is initialized
	 */
	ngOnInit(): void {
		this.loadMappings(PAGE, SIZE);
	}

	/**
	 * Loads the mappings list.
	 */
	loadMappings(page: number, size: number): void {
		this.mappingService
			.listMappings(page, size)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PageSearchMappingDTO) => {
				this.mappings = data.content ?? [];
				this.paginationInfo = data;
			});
	}

	/**
	 * Delete mapping by its id.
	 */
	deleteMapping(id: number): void {
		this.mappingService
			.deleteMapping(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.loadMappings(PAGE, SIZE);
				this.notificationService.showSuccess(MESSAGES_MAPPINGS_SUCCESS_DELETED);
			});
		this.deleteDialogVisible = false;
	}

	/**
	 * Loads the executions list.
	 */
	loadExecutionsHistory(id: number): void {
		this.mappingService
			.listExecutions(id, PAGE, SIZE)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PagedModelExecutionDTO) => {
				this.executionHistory = data.content ?? [];
			});
	}

	/**
	 * Method that is called when the page number changes.
	 */
	onPageChange(newPage: number): void {
		this.loadMappings(newPage, this.paginationInfo.size);
	}

	/**
	 * Display materialisation history dialog
	 */
	showDialog(mapping: SearchMappingDTO) {
		this.selectedMapping = mapping;
		this.loadExecutionsHistory(mapping.id);
		this.addDialogVisible = true;
	}

	/**
	 * Display delete dialog
	 */
	showDialogDelete(mapping: SearchMappingDTO): void {
		this.selectedMapping = mapping;
		this.deleteDialogVisible = true;
	}

	showDialogAuto() {
		this.autoDialogVisible = true;
	}

	/**
	* Close delete dialog
	*/
	cancelDelete(): void {
		this.deleteDialogVisible = false;
	}

	categories: unknown[] = [
		{ name: 'Test 1', key: 'A' },
		{ name: 'Test 2', key: 'M' },
		{ name: 'Test 3', key: 'P' },
		{ name: 'Test 4', key: 'R' }
	];
}

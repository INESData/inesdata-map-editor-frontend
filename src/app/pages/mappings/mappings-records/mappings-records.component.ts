import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExecutionDTO, ExecutionService, MappingService, PagedModelExecutionDTO } from 'projects/mapper-api-client';
import { finalize } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_MATERIALISATIONS_SUCCESS, PAGE, SIZE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-mappings-records',
	templateUrl: './mappings-records.component.html'
})
export class MappingsRecordsComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(
		private mappingService: MappingService,
		private executionService: ExecutionService,
		private notificationService: NotificationService
	) { }


	@Input() mappingId: number;
	executionHistory: ExecutionDTO[];

	/**
	 * Loads the execution history when the component is initialized
	 */
	ngOnInit(): void {
		this.loadExecutionsHistory()
	}

	/**
	 * Loads the executions history list.
	 */
	loadExecutionsHistory(): void {
		this.mappingService
			.listExecutions(this.mappingId, PAGE, SIZE)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: PagedModelExecutionDTO) => {
				this.executionHistory = data.content ?? [];
			});
	}

	/**
	 * Execute new materialisation
	 */
	newMaterialisation(id: number) {
		this.mappingService
			.materializeMapping(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				// Refresh the execution history on operation success or error
				finalize(() => {
					this.loadExecutionsHistory();
				})
			)
			.subscribe({
				next: () => {
					// Success notification only when materialisation is successful
					this.notificationService.showSuccess(MESSAGES_MATERIALISATIONS_SUCCESS);
				}
			});
	}

	/**
	 * Download selected file
	 */
	downloadFile(id: number, fileName: string) {
		this.executionService
			.downloadFile(id, fileName)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((value) => {
				const blob = new Blob([value]);
				const data = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = data;
				link.download = fileName;
				link.click();
			});
	}
}

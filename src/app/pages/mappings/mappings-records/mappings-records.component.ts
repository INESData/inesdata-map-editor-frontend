import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExecutionDTO, ExecutionService, MappingDTO, MappingService } from 'projects/mapper-api-client';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_MATERIALISATIONS_SUCCESS } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-mappings-records',
	templateUrl: './mappings-records.component.html'
})
export class MappingsRecordsComponent {
	destroyRef = inject(DestroyRef);

	constructor(
		private mappingService: MappingService,
		private executionService: ExecutionService,
		private notificationService: NotificationService
	) {}

	@Input() mapping: MappingDTO;
	@Input() executionHistory: ExecutionDTO[];

	/**
	 * Execute new materialisation
	 */
	newMaterialisation(id: number) {
		this.mappingService
			.materializeMapping(id)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.notificationService.showSuccess(MESSAGES_MATERIALISATIONS_SUCCESS);
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

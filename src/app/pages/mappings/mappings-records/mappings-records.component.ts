import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExecutionDTO, MappingDTO, MappingService } from 'projects/mapper-api-client';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_MATERIALISATIONS_SUCCESS } from 'src/app/shared/utils/app.constants';


@Component({
	selector: 'app-mappings-records',
	templateUrl: './mappings-records.component.html'
})
export class MappingsRecordsComponent {

	destroyRef = inject(DestroyRef);

	constructor(private mappingService: MappingService, private notificationService: NotificationService) { }

	@Input() mapping: MappingDTO;
	@Input() executionHistory: ExecutionDTO[];

	newMaterialisation(id: number) {
		this.mappingService
			.materializeMapping(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.notificationService.showSuccess(MESSAGES_MATERIALISATIONS_SUCCESS);
			});
	}
}

import { Component, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MappingDTO, MappingService } from 'projects/mapper-api-client';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MAPPINGS, MESSAGES_MAPPINGS_ERRORS_NONAME, MESSAGES_MAPPINGS_RULE_INCOMPLETE, MESSAGES_MAPPINGS_SUCCESS_CREATED, MESSAGES_MAPPINGS_SUCCESS_UPDATED } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-mappings-summary',
	templateUrl: './mappings-summary.component.html'
})
export class MappingsSummaryComponent implements OnChanges {
	destroyRef = inject(DestroyRef);

	constructor(private mappingService: MappingService, private notificationService: NotificationService,
		private router: Router, private languageService: LanguageService) { }

	mappingName: string;
	mappingBaseUrl: string;
	mappingId: number;
	mapping: unknown[] = [];
	errorMessage = '';

	@Input() mappingDTO: MappingDTO;

	/**
	 * Update mapping name and base url when the input mappingDTO changes
	 */
	ngOnChanges(changes): void {
		if (changes.mappingDTO?.currentValue) {
			this.mappingName = this.mappingDTO.name;
			this.mappingBaseUrl = this.mappingDTO.baseUrl;
		}
	}

	/**
	* Clear error message on input change
	*/
	onMappingNameChange(): void {
		if (this.mappingName.trim() !== '') {
			this.errorMessage = '';
		}
	}

	/**
	* Clear error message on input change
	*/
	onMappingBaseUrlChange(): void {
		if (this.mappingBaseUrl.trim() !== '') {
			this.errorMessage = '';
		}
	}

	/**
	 * Deletes selected field from mapping
	 */
	deleteFieldFromMapping(index: number): void {
		if (index > -1 && index < this.mappingDTO.fields.length) {
			this.mappingDTO.fields.splice(index, 1);
		}
	}

	/**
	* Generates a mapping and call the mapping service to create it.
	*/
	generateMapping(): void {
		// Validate mapping
		if (!this.mappingDTO?.fields?.length) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_RULE_INCOMPLETE);
			return;
		}
		if (!this.mappingDTO && !this.validateAndAssignMappingName()) {
			return;
		}

		this.mappingDTO?.fields?.forEach(field => {
			if (field.subject) {
				field.subject.className = `${this.mappingDTO.baseUrl}${field.subject.className}`;
			}
			if (field.predicates) {
				field.predicates.forEach(predicate => {
					predicate.predicate = `${this.mappingDTO.baseUrl}${predicate.predicate}`;
				});
			}
		});

		this.mappingService
			.create(this.mappingDTO)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe(() => {
				this.router.navigate([MAPPINGS]);
				this.notificationService.showSuccess(MESSAGES_MAPPINGS_SUCCESS_CREATED);
			})
	}

	/**
	 * Updates the mapping
	 */
	editMapping(): void {
		// Validate mapping
		if (!this.validateAndAssignMappingName()) {
			return;
		}

		this.mappingService
			.updateMapping(this.mappingId, this.mappingDTO)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: MappingDTO) => {
				this.mappingDTO = data;
				this.router.navigate([MAPPINGS]);
				this.notificationService.showSuccess(MESSAGES_MAPPINGS_SUCCESS_UPDATED);
			})
	}

	/**
	 * Validate and assign mapping name
	 */
	validateAndAssignMappingName(): boolean {
		if (this.mappingName.trim() === '' || this.mappingBaseUrl.trim() === '') {
			this.errorMessage = this.languageService.translateValue(MESSAGES_MAPPINGS_ERRORS_NONAME);
			return false;
		}
		this.errorMessage = '';
		this.mappingDTO.name = this.mappingName;
		this.mappingDTO.baseUrl = this.mappingBaseUrl;
		return true;
	}

}

import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MappingDTO, MappingService } from 'projects/mapper-api-client';
import { Output } from 'src/app/shared/models/output.model';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MAPPINGS, MESSAGES_ERRORS, MESSAGES_MAPPINGS_ERRORS_NONAME, MESSAGES_MAPPINGS_PAIRS, MESSAGES_MAPPINGS_SUCCESS_CREATED, MESSAGES_MAPPINGS_SUCCESS_UPDATED, RML_REFERENCE } from 'src/app/shared/utils/app.constants';

@Component({
	selector: 'app-mappings-summary',
	templateUrl: './mappings-summary.component.html'
})
export class MappingsSummaryComponent {
	destroyRef = inject(DestroyRef);

	constructor(private mappingService: MappingService, private notificationService: NotificationService,
		private router: Router, private languageService: LanguageService) { }

	mappingName = '';
	mappingBaseUrl = '';
	errorMessage = '';
	mapping: Output[] = [];
	mappingId: number;
	mappingDTO: MappingDTO;


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
	 * Deletes selected pair from mapping
	 */
	deletePairFromMapping(index: number): void {
		if (index > -1 && index < this.mapping.length) {
			this.mapping.splice(index, 1);
		}
	}

	/**
* Builds the mapping fields based on the current mappings
* and updates the mappingDTO with the generated fields.
*/
	buildMapping(): void {

		if (this.mapping && this.mapping.length > 0) {
			const outputs: Output[] = this.mapping;

			const mappingFields = outputs.map(output => {
				const classNameUrl = `${output.ontologyUrl}${output.ontologyClass}`;
				const predicateUrl = `${output.ontologyUrl}${output.ontologyAttribute}`;

				return {
					dataSourceId: output.dataSourceId,
					ontologyId: output.ontologyId,
					predicates: [
						{
							objectMap: [
								{
									key: RML_REFERENCE,
									literalValue: output.dataSourceField
								}
							],
							predicate: predicateUrl
						}
					],
					subject: {
						className: classNameUrl,
						template: `${classNameUrl}/{id}`
					}
				};
			});

			this.mappingDTO = {
				name: "",
				baseUrl: "",
				ontologyIds: [1, 2], //TODO: Obtener de la selección
				fields: mappingFields
			};

			if (!this.mappingId) {
				this.generateMapping();
			} else {
				this.editMapping();
			}

		} else {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PAIRS, MESSAGES_ERRORS);
		}
	}

	/**
* Generates a mapping and call the mapping service to create it.
*/
	generateMapping(): void {
		// Validate mapping
		if (!this.validateAndAssignMappingName()) {
			return;
		}

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

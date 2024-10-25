import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseSourceDTO, FileSourceDTO, FileSourceService, MappingDTO, MappingService, OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { Output } from 'src/app/shared/models/output.model';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MAPPINGS, MESSAGES_ERRORS, MESSAGES_MAPPINGS_ERRORS_NONAME, MESSAGES_MAPPINGS_PAIRS, MESSAGES_MAPPINGS_SUCCESS_CREATED, MESSAGES_MAPPINGS_SUCCESS_UPDATED, PARAM_ID, RML_REFERENCE, URL_DELIMITER, URL_MAPPINGS } from 'src/app/shared/utils/app.constants';
import { mapToDataSource } from 'src/app/shared/utils/types.utils';
@Component({
	selector: 'app-mappings-builder',
	templateUrl: './mappings-builder.component.html'
})
export class MappingsBuilderComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(private ontologyService: OntologyService, private fileSourceService: FileSourceService, private mappingService: MappingService, private notificationService: NotificationService,
		private router: Router, private languageService: LanguageService, private route: ActivatedRoute) { }

	formats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	mapping: Output[] = [];
	mappingDTO: MappingDTO;
	mappingName = '';
	mappingBaseUrl = '';
	mappingId: number;
	selectedFormat;
	ontologies: SearchOntologyDTO[];
	classes: string[];
	attributes: string[];

	dataSources: FileSourceDTO[] | DataBaseSourceDTO[];
	fileFields: string[];
	queryDialogVisible = false;
	elementDialogVisible = false;

	selectedOntology: SearchOntologyDTO = null;
	selectedClass: string = null;
	selectedAttribute: string = null;

	selectedSource: FileSourceDTO | DataBaseSourceDTO = null;
	selectedField: string;
	errorMessage = '';

	showDialogQuery() {
		this.queryDialogVisible = true;
	}

	showDialogElement() {
		this.elementDialogVisible = true;
	}

	/**
	 * Initializes the component and subscribe to route parameter to get the ID
	 * if provided. Otherwise, load ontologies.
	 *
	 */
	ngOnInit() {
		this.getOntologies();
		this.route.paramMap.subscribe((params) => {
			this.mappingId = +params.get(PARAM_ID);
		})
		if (this.mappingId) {
			this.getMapping(this.mappingId);
		}
	}

	/**
	 * Gets the list of ontologies.
	 */
	getOntologies(): void {
		this.ontologyService
			.getOntologies()
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: SearchOntologyDTO[]) => {
				this.ontologies = data ?? [];
			});
	}

	/**
	 * Gets the classes of the selected ontology.
	 */
	getClasses(id: number): void {
		this.ontologyService
			.getOntologyClasses(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.classes = data ?? [];
			})
	}

	/**
	 * Gets the attributes of the selected ontology class.
	 */
	getAttributes(id: number, className: string): void {
		this.ontologyService
			.getOntologyAttributes(id, className)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.attributes = data ?? [];
			})
	}

	/**
	 * Gets the selected ontology class
	 */
	onOntologySelect(ontology: SearchOntologyDTO): void {
		this.selectedClass = null;
		this.selectedAttribute = null;
		this.attributes = null;
		this.getClasses(ontology.id);
	}

	/**
	 * Gets the selected ontology class attributes
	 */
	onClassSelect(className: string): void {
		this.selectedAttribute = null;
		this.attributes = null;
		this.getAttributes(this.selectedOntology.id, className);

	}

	/**
	 * Retrieves data based on the specified format
	 */
	getDataFromFormat(format: string): void {
		this.selectedSource = null;
		const type = mapToDataSource(format);
		if (type == DataSourceTypeEnum.FILE) {
			this.getFileData(format);
		}
	}

	/**
	 * Retrieves file data based on the specified type
	 */
	getFileData(type: string): void {
		this.fileSourceService
			.getFileSourceByType(type)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: FileSourceDTO[]) => {
				this.dataSources = data ?? [];
			})
	}

	/**
	 * Handles the selection of a source, which can be either a FileSourceDTO or a DataBaseSourceDTO
	 */
	onSourceSelected(source: FileSourceDTO | DataBaseSourceDTO): void {
		this.selectedSource = source;
		this.selectedField = null;
		switch (this.selectedFormat) {
			case DataFileTypeEnum.CSV:
				this.getFields(source.id);
				break;
			case DataFileTypeEnum.XML:
				this.getXMLAttributes(source.id);
				break;
		}
	}

	/**
	 * Retrieves the fields for a given source ID
	 */
	getFields(id: number): void {
		this.fileSourceService
			.getFileFields(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.fileFields = data ?? [];
			})
	}

	/**
	 * Retrieves the XML attributes for a given file source ID
	 */
	getXMLAttributes(id: number): void {
		this.fileSourceService
			.getFileAttributes(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.fileFields = data ?? [];
			})
	}
	/**
	 * Collect information from the selected ontology, data source, etc.
	 * add it tho the output and appends it to mapping
	 */
	addOutput(): void {
		const { selectedOntology, selectedClass, selectedAttribute, selectedSource, selectedField } = this;

		if (selectedOntology?.id && selectedClass && selectedAttribute && selectedSource?.id && selectedField) {

			const output: Output = {
				ontologyId: this.selectedOntology.id,
				ontologyClass: this.selectedClass,
				ontologyAttribute: this.selectedAttribute,
				dataSourceId: this.selectedSource.id,
				dataSourceField: this.selectedField,
			};
			this.mapping = [...this.mapping, output];

		} else {

			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PAIRS, MESSAGES_ERRORS);
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
				const classNameUrl = `${URL_MAPPINGS}${output.ontologyClass}`;
				const predicateUrl = `${URL_MAPPINGS}${output.ontologyAttribute}`;

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
	 * Gets the mapping data for the given mapping ID
	 */
	getMapping(id: number): void {
		this.mappingService
			.getMapping(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: MappingDTO) => {
				this.mappingDTO = data;
				this.processMapping(this.mappingDTO)
			})
	}

	/**
	 * Processes the given mappingDTO and fill the mapping array with output entries
	 */
	processMapping(mappingDTO: MappingDTO): void {
		this.mappingName = this.mappingDTO.name;
		this.mappingBaseUrl = this.mappingDTO.baseUrl;

		// Iterate through each field in the mappingDTO
		mappingDTO.fields.forEach(field => {
			// Iterate through each predicate
			field.predicates.forEach(predicate => {
				// Iterate through each object map of the current predicate
				predicate.objectMap.forEach(objectMap => {
					// Construct the output entry based on the field, predicate, and object map
					const mappingOutput: Output = {
						ontologyId: field.ontologyId,
						ontologyClass: field.subject.className.split(URL_DELIMITER).pop(),
						ontologyAttribute: predicate.predicate.split(URL_DELIMITER).pop(),
						dataSourceId: field.dataSourceId,
						dataSourceField: objectMap.literalValue
					};

					this.selectedAttribute = field.subject.className.replace(URL_MAPPINGS, '');
					// Add the constructed output entry to the mapping
					this.mapping.push(mappingOutput);
				});
			});
		});
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

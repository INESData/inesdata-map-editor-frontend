import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseSourceDTO, FileSourceDTO, FileSourceService, MappingDTO, MappingService, OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';
import { DataTypeEnum } from 'src/app/shared/enums/data-type.enum';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { Output } from 'src/app/shared/models/output.model';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_ERRORS, MESSAGES_MAPPINGS_PAIRS, PARAM_ID, PROPERTIES_ANNOTATION, PROPERTIES_ASSOCIATED, PROPERTIES_DATA, PROPERTIES_OBJECT, URL_DELIMITER } from 'src/app/shared/utils/app.constants';
import { mapToDataSource } from 'src/app/shared/utils/types.utils';

import { PropertyDTO } from '../../../../../projects/mapper-api-client/model/propertyDTO';
@Component({
	selector: 'app-mappings-builder',
	templateUrl: './mappings-builder.component.html'
})
export class MappingsBuilderComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(private ontologyService: OntologyService, private fileSourceService: FileSourceService, private mappingService: MappingService, private notificationService: NotificationService,
		private router: Router, private languageService: LanguageService, private route: ActivatedRoute) { }

	formats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	dataTypes: string[] = [...Object.values(DataTypeEnum)];
	mapping: Output[] = [];
	mappingDTO: MappingDTO;
	mappingName = '';
	mappingBaseUrl = '';
	mappingId: number;
	selectedFormat;
	selectedType;
	ontologies: SearchOntologyDTO[];
	subjectClasses: string[];
	predicateClasses: string[];
	properties: PropertyDTO[];
	source: string;

	dataSources: FileSourceDTO[] | DataBaseSourceDTO[];
	fileFields: string[];
	queryDialogVisible = false;
	elementDialogVisible = false;

	selectedOntology: SearchOntologyDTO = null;
	selectedObjectOntology: SearchOntologyDTO = null;
	selectedPredicateOntology: SearchOntologyDTO = null;
	selectedPredicateClass: string = null;
	selectedObjectClass: string = null;
	selectedClass: string = null;
	selectedProperty: string = null;

	selectedSource: FileSourceDTO | DataBaseSourceDTO = null;
	selectedField: string;
	termType = '';

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
				if (this.source === 'subject') {
					this.subjectClasses = data ?? [];
				} else if (this.source === 'predicate') {
					this.predicateClasses = data ?? [];
				}
			})
	}

	/**
	 * Gets the properties of the selected ontology class.
	 */
	getProperties(id: number, className: string): void {
		this.ontologyService
			.getClassProperties(id, className)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: PropertyDTO[]) => {
				this.properties = data ?? [];
			})
	}

	/**
	 * Gets the selected ontology class
	 */
	onOntologySelect(ontology: SearchOntologyDTO, source: 'subject' | 'predicate'): void {
		this.source = source;
		if (this.source === 'subject') {
			this.subjectClasses = null;
			this.selectedObjectClass = null;
		} else if (this.source === 'predicate') {
			this.properties = null;
			this.predicateClasses = null;
			this.selectedPredicateClass = null;
		}
		this.getClasses(ontology.id);
	}

	/**
	 * Gets the selected ontology class properties
	 */
	onClassSelect(className: string): void {
		this.selectedProperty = null;
		this.getProperties(this.selectedPredicateOntology.id, className);
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
		const { selectedOntology, selectedClass, selectedProperty, selectedSource, selectedField } = this;

		if (selectedOntology?.id && selectedClass && selectedProperty && selectedSource?.id && selectedField) {

			const output: Output = {
				ontologyId: this.selectedOntology.id,
				ontologyUrl: this.selectedOntology.url,
				ontologyClass: this.selectedClass,
				ontologyAttribute: this.selectedProperty,
				dataSourceId: this.selectedSource.id,
				dataSourceField: this.selectedField,
			};
			this.mapping = [...this.mapping, output];

		} else {

			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PAIRS, MESSAGES_ERRORS);
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
						ontologyId: 1, //TODO: Obtener de la selección
						ontologyUrl: field.subject.className.substring(0, field.subject.className.lastIndexOf('/') + 1),
						ontologyClass: field.subject.className.split(URL_DELIMITER).pop(),
						ontologyAttribute: predicate.predicate.split(URL_DELIMITER).pop(),
						dataSourceId: field.dataSourceId,
						dataSourceField: objectMap.literalValue
					};

					this.selectedProperty = field.subject.className.split(URL_DELIMITER).pop();
					// Add the constructed output entry to the mapping
					this.mapping.push(mappingOutput);
				});
			});
		});
	}

	/**
	 * Returns the corresponding icon class and for the property type
	 */
	getIconAndTitle(property: PropertyDTO): { iconClasses: string[], titles: string[] } {
		const iconClasses = [];
		const titles = [];

		switch (property.propertyType) {
			case 'DATA':
				iconClasses.push('pi pi-table');
				titles.push(this.languageService.translateValue(PROPERTIES_DATA));
				break;


			case 'OBJECT':
				iconClasses.push('pi pi-box');
				titles.push(this.languageService.translateValue(PROPERTIES_OBJECT));
				break;

			case 'ANNOTATION':
				iconClasses.push('pi pi-pen-to-square');
				titles.push(this.languageService.translateValue(PROPERTIES_ANNOTATION));
				break;

			default:
				break;
		}
		if (property.associated) {
			iconClasses.push('pi pi-link');
			titles.push(this.languageService.translateValue(PROPERTIES_ASSOCIATED));
		}

		return { iconClasses, titles };
	}

	setTermType(type: string) {
		this.termType = type;
	}
}

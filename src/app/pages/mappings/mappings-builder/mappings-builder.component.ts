import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CustomClassDTO, CustomPropertyDTO, DataBaseSourceDTO, DataBaseSourceService, DataSourceDTO, DataSourceService, FileSourceDTO, FileSourceService, MappingDTO, MappingService, NamespaceDTO, ObjectMapDTO, OntologyService, PredicateObjectMapDTO, PropertyDTO, SearchOntologyDTO } from 'projects/mapper-api-client';
import { DataTypeEnum } from 'src/app/shared/enums/data-type.enum';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { PropertyTypeEnum } from 'src/app/shared/enums/property-type.enum';
import { TermType } from 'src/app/shared/models/term-type.model';
import { TERM_TYPES } from 'src/app/shared/models/term-types';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MAPPINGS_PREDICATE_ALLCLASSES, MESSAGES_ERRORS, MESSAGES_MAPPINGS_CLASS_EXISTS, MESSAGES_MAPPINGS_ERRORS_NODATATYPE, MESSAGES_MAPPINGS_ERRORS_NOITERATOR, MESSAGES_MAPPINGS_ERRORS_SELECTEDDB, MESSAGES_MAPPINGS_ERRORS_TYPE, MESSAGES_MAPPINGS_PREDICATE_INCOMPLETE, MESSAGES_MAPPINGS_PROPERTY_EXISTS, MESSAGES_MAPPINGS_PROPERTY_INCOMPLETE, MESSAGES_MAPPINGS_RULE_INCOMPLETE, PARAM_ID, PROPERTIES_ANNOTATION, PROPERTIES_DATA, PROPERTIES_OBJECT, RML_DATATYPE, RML_IRI, RML_LITERAL, RML_REFERENCE, RML_TEMPLATE, RML_TERMTYPE } from 'src/app/shared/utils/app.constants';
import { mapToDataSource } from 'src/app/shared/utils/types.utils';

@Component({
	selector: 'app-mappings-builder',
	templateUrl: './mappings-builder.component.html'
})
export class MappingsBuilderComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(private ontologyService: OntologyService, private fileSourceService: FileSourceService, private dataBaseService: DataBaseSourceService, private mappingService: MappingService, private notificationService: NotificationService, private languageService: LanguageService, private route: ActivatedRoute, private dataSourceService: DataSourceService) { }

	formats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	dataTypes: string[] = [...Object.values(DataTypeEnum)];
	type = 'FILE';

	queryDialogVisible = false;
	classDialogVisible = false;
	propertyDialogVisible = false;
	mappingDTO: MappingDTO;
	mappingId: number;

	ontologies: SearchOntologyDTO[];
	dataSources: FileSourceDTO[];
	dataBasesList: DataBaseSourceDTO[] = [];
	dataBases = [];
	dbTableNames: string[];
	selectedDb: number;
	selectedTable: string;
	properties: PropertyDTO[];
	propertyTypes: string[] = [...Object.values(PropertyTypeEnum)];
	subjectClasses: string[];
	predicateClasses: string[];

	selectedSourceFormat = '';
	selectedSource: FileSourceDTO | DataBaseSourceDTO = null;
	selectedSubjectOntology: SearchOntologyDTO = null;
	selectedSubjectClass: string = null;
	iterator?: string;
	templateUrl: string;

	selectedPredicateOntology: SearchOntologyDTO = null;
	selectedPredicateClass: string = null;
	selectedPredicateProperty: string = null;
	selectedPredicatePropertyUrl: string = null;

	objectMapValue: string;
	selectedDataType: string = DataTypeEnum.STRING;

	source: string;
	sourceFields: string[];
	selectedField: string;
	errorMessage: string;
	termType: TermType[];
	currentTermType = 'iri';
	isNewTriplesMap = false;
	isFirstEdition = true;
	namespaceMap: Record<string, string>;
	suggestions: string[];
	inputValue: string;
	selectedNamespace: NamespaceDTO;
	blockedSubject = false;
	databaseConnectionId: number;
	mappingType = null;

	searchSources = '';
	searchTableNames = '';
	searchOntologies = '';
	searchSubjectClasses = '';
	searchPredicateOntologies = '';
	searchPredicateClasses = '';
	searchProperties = '';

	queryName = '';
	query = '';
	blockTables = false;
	blockQuery = false;
	customClass = '';
	addClassTo: 'subject' | 'predicate';
	customProperty = '';
	selectedPropertyType: string;
	customClasses: string[] = [];

	mappingName = '';
	mappingBaseUrl = '';

	/**
	 * Initializes the component and subscribe to route parameter to get the ID
	 * if provided. Otherwise, load ontologies.
	 *
	 */
	ngOnInit() {
		this.termType = TERM_TYPES;
		this.getOntologies();
		this.route.paramMap.subscribe((params) => {
			this.mappingId = +params.get(PARAM_ID);
		})
		if (this.mappingId) {
			this.getMapping(this.mappingId);
		}
	}

	showDialogQuery() {
		this.queryDialogVisible = true;
	}

	showDialogClass(target: 'subject' | 'predicate') {
		this.addClassTo = target;
		this.classDialogVisible = true;
	}

	showDialogProperty() {
		this.propertyDialogVisible = true;
	}

	/**
	 * Adds query and get column names
	 */
	addQuery(): void {
		this.selectedTable = null;
		this.blockTables = true;
		this.queryDialogVisible = false;
		this.getQueryColumnNames(this.query);
	}

	/**
	 * Adds custom class to subject or predicate class list
	 */
	addClass(): void {
		if (!this.customClass) return;
		const targetClasses = this.addClassTo === 'subject' ? this.subjectClasses : this.predicateClasses;

		if (targetClasses.includes(this.customClass)) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_CLASS_EXISTS, MESSAGES_ERRORS);
			return;
		}

		targetClasses.unshift(this.customClass);
		this.customClasses.push(this.customClass);
		this.saveClass();
		this.classDialogVisible = false;
		this.customClass = null;
	}

	/**
	 * Adds custom property to the properties list
	 */
	addProperty(): void {
		if (!this.customProperty || !this.selectedPropertyType) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PROPERTY_INCOMPLETE, MESSAGES_ERRORS);
			return;
		}

		const propertyPrefix = Object.keys(this.namespaceMap).find(key => this.namespaceMap[key] === this.selectedPredicateOntology.url);
		const propertyName = propertyPrefix + ':' + this.customProperty;
		if (this.properties.some(p => p.name === propertyName && p.propertyType === this.selectedPropertyType)) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PROPERTY_EXISTS, MESSAGES_ERRORS);
			return;
		}

		this.properties.unshift({
			name: propertyName,
			propertyType: this.selectedPropertyType as PropertyTypeEnum
		});
		this.saveProperty(propertyName);
		this.propertyDialogVisible = false;
		this.customProperty = null;
		this.selectedPropertyType = null;
	}

	/**
	 * Deletes the query
	 */
	deleteQuery(): void {
		this.query = null;
		this.queryName = null;
		this.queryDialogVisible = false;
		this.blockTables = false;
	}

	/**
	 * Updates the mapping name with the value from child
	 */
	onMappingNameUpdate(name: string): void {
		this.mappingName = name;
	}

	/**
	 * Updates the mapping base url with the value from child
	 */
	onMappingBaseUrlUpdate(url: string): void {
		this.mappingBaseUrl = url;
	}

	/**
	 * Clear mapping, mapping type and database connection if no predicate-object in fields
	 */
	clearMapping(): void {
		this.mappingDTO = null;
		this.mappingType = null;
		this.databaseConnectionId = null;
	}

	/**
	 * Saves the added custom class
	 */
	saveClass(): void {
		const customClassDTO: CustomClassDTO = {
			ontologyId: this.addClassTo === 'subject' ? this.selectedSubjectOntology.id : this.selectedPredicateOntology.id,
			name: this.customClass
		}
		this.ontologyService
			.saveCustomClass(customClassDTO)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	/**
	 * Saves the added custom property
	 */
	saveProperty(property: string): void {
		const customPropertyDTO: CustomPropertyDTO = {
			ontologyId: this.selectedPredicateOntology.id,
			name: property,
			type: this.selectedPropertyType as CustomPropertyDTO.TypeEnum
		}
		this.ontologyService
			.saveCustomProperty(customPropertyDTO)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
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
				takeUntilDestroyed(this.destroyRef),
			).subscribe((data: string[]) => {
				if (this.source === 'subject') {
					this.subjectClasses = data ?? [];
				} else if (this.source === 'predicate') {
					this.predicateClasses = [this.languageService.translateValue(MAPPINGS_PREDICATE_ALLCLASSES), ...(data ?? [])];
					this.selectedPredicateClass = this.languageService.translateValue(MAPPINGS_PREDICATE_ALLCLASSES);
					this.onClassSelect('');
				}
			});
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
			this.selectedSubjectClass = null;
		} else if (this.source === 'predicate') {
			this.properties = null;
			this.predicateClasses = null;
			this.selectedPredicateClass = null;
			this.getNamespaceMap();
		}
		this.getClasses(ontology.id);
	}

	/**
	 * Gets the selected ontology class properties
	 */
	onClassSelect(className: string): void {
		this.selectedPredicateProperty = null;
		if (className === this.languageService.translateValue(MAPPINGS_PREDICATE_ALLCLASSES) || (this.customClasses.length > 0 && this.customClasses.includes(className))) {
			className = '';
		}
		this.getProperties(this.selectedPredicateOntology.id, className);
	}

	/**
	 * Retrieves data based on the specified format
	 */
	getDataFromFormat(format: string): void {
		this.selectedSource = null;
		this.dbTableNames = null;
		this.type = mapToDataSource(format);
		if (this.mappingDTO != null && this.mappingType !== null && this.mappingType !== this.type) {
			const errorMessage = this.languageService.translateValue(MESSAGES_MAPPINGS_ERRORS_TYPE) + ` ${this.mappingType}`;
			this.notificationService.showErrorMessage(errorMessage, MESSAGES_ERRORS);
			return;
		}
		if (this.type == DataSourceTypeEnum.FILE) {
			this.getFileData(format);
		} else if (this.type == DataSourceTypeEnum.DATABASE) {
			this.getDataBases(format);
		}
		this.mappingType = this.type;
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
		switch (this.selectedSourceFormat) {
			case DataFileTypeEnum.CSV:
				this.getFields(source.id);
				break;
			case DataFileTypeEnum.XML:
				this.getFileAttributes(source.id, this.iterator);
				break;
		}
	}

	/**
	 * Handles the selection of a source and iterator and retrieves file attributes
	 */
	onSourceIteratorSelected(): void {
		if (this.selectedSourceFormat === DataFileTypeEnum.JSON && this.selectedSource != null && this.iterator && this.iterator.length > 0) {
			this.getFileAttributes(this.selectedSource.id, this.iterator);
		}
	}

	/**
	 * Retrieves the column names for the selected table from the database
	 */
	onTableSelected(name: string) {
		this.dataBaseService
			.getColumnNames(this.selectedDb, name)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.sourceFields = data ?? [];
			})
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
				this.sourceFields = data ?? [];
			})
	}

	/**
	 * Retrieves the XML and JSON attributes for a given file source ID
	 */
	getFileAttributes(id: number, iterator: string): void {
		this.fileSourceService
			.getFileAttributes(id, iterator)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.sourceFields = data ?? [];
			})
	}

	/**
	 * Gets the list of databases based on the specified format
	 */
	getDataBases(format: string): void {
		this.dataBaseService
			.getDataBaseSourceByType(format)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: DataBaseSourceDTO[]) => {
				this.dataBasesList = data ?? [];
				this.dataBases = this.dataBasesList.map(db => ({
					label: db.name,
					value: db.id
				}));
			});
	}

	/**
	 * Gets the list of table names for the selected database
	 */
	getDbTables(id: number): void {
		if (this.databaseConnectionId != null && this.databaseConnectionId !== id && this.mappingDTO != null) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_ERRORS_SELECTEDDB, MESSAGES_ERRORS);
			return;
		}
		this.selectedDb = id;
		this.dataBaseService
			.getTableNames(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.dbTableNames = data ?? [];
			})
		this.databaseConnectionId = id;
	}

	/**
	 * Gets all column names from query
	 */
	getQueryColumnNames(query: string): void {
		this.dataBaseService
			.getQueryColumnNames(query)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: string[]) => {
				this.sourceFields = data ?? [];
			});
	}

	/**
	 * Collect information from subject, predicate and object and
	 * add it to the mapping DTO
	 */
	addRule(): void {

		const { selectedSource, selectedDb, type, selectedSourceFormat, templateUrl, iterator, selectedTable, query, queryName, selectedSubjectClass, selectedPredicatePropertyUrl, objectMapValue, currentTermType, selectedDataType, mappingDTO, isNewTriplesMap, isFirstEdition } = this;

		const sourceId = type === 'FILE' ? selectedSource?.id : selectedDb;

		// Rule must be completed
		if (!(sourceId && selectedSourceFormat && selectedSubjectClass && templateUrl && selectedSubjectClass && selectedPredicatePropertyUrl && objectMapValue && currentTermType)) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_RULE_INCOMPLETE, MESSAGES_ERRORS);
			return;
		}

		// Validate iterator and data type (non required fields in rule)
		if (!this.validateMappingInputs()) return;

		// Create object-predicate DTOs
		const objectMap = this.createObjectMap(objectMapValue, currentTermType, selectedDataType);
		const predicate = this.createPredicate(selectedPredicatePropertyUrl, objectMap);

		// On create
		if (!mappingDTO?.id) {
			//If no mapping DTO, create it
			if (!mappingDTO) {
				this.createMappingDTO(sourceId, selectedSourceFormat, iterator, selectedTable, query, queryName, templateUrl, selectedSubjectClass, predicate);
			} else if (mappingDTO.fields) {
				// Mapping DTO exists, process fields
				this.processMappingField(isNewTriplesMap, sourceId, selectedSourceFormat, iterator, selectedTable, templateUrl, selectedSubjectClass, predicate);
			}
			// On update
		} else {
			if (isFirstEdition) {
				// On first rule of edition (is first edition true)
				this.addNewFieldToMapping(sourceId, selectedSourceFormat, iterator, selectedTable, templateUrl, selectedSubjectClass, predicate);
				this.isNewTriplesMap = false;
				this.isFirstEdition = false;
			} else {
				// On next rules of edition
				this.processMappingField(isNewTriplesMap, sourceId, selectedSourceFormat, iterator, selectedTable, templateUrl, selectedSubjectClass, predicate);
			}
		}
		this.addNamespaceToMapping(this.selectedNamespace);
		this.clearObjectPredicate();
	}

	/**
	 * Processes a mapping field based on creating a new triples map or update an existing one
	 */
	processMappingField(isNewTriplesMap: boolean, selectedSourceId: number, selectedSourceFormat: string, iterator: string, selectedTable: string, templateUrl: string, selectedSubjectClass: string, predicate: PredicateObjectMapDTO[]): void {
		if (isNewTriplesMap) {
			// Add field
			this.addNewFieldToMapping(selectedSourceId, selectedSourceFormat, iterator, selectedTable, templateUrl, selectedSubjectClass, predicate);
			this.isNewTriplesMap = false;
			this.blockedSubject = true;
		} else {
			// Add predicate-object pair to field
			this.addPredicateToField(predicate);
			this.blockedSubject = true;
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
				this.getSourceById(this.mappingDTO.fields[0].dataSourceId);
				this.databaseConnectionId = this.mappingDTO.fields[0].dataSourceId;
			})
	}

	/**
	 * Create object map DTO
	 */
	createObjectMap(objectMapValue: string, currentTermType: string, selectedDataType?: string): ObjectMapDTO[] {
		const objectMap: ObjectMapDTO[] = [
			{ key: currentTermType === 'literal' ? RML_REFERENCE : RML_TEMPLATE, literalValue: objectMapValue },
			{ key: RML_TERMTYPE, literalValue: currentTermType === 'literal' ? RML_LITERAL : RML_IRI },
		];

		if (currentTermType === 'literal') {
			objectMap.push({ key: RML_DATATYPE, literalValue: "xsd:" + selectedDataType });
		}

		return objectMap;
	}

	/**
	 * Create predicate DTO
	 */
	createPredicate(predicateName: string, objectMap: ObjectMapDTO[]): PredicateObjectMapDTO[] {
		return [
			{
				predicate: predicateName,
				objectMap: objectMap,
			},
		];
	}

	/**
	 * Create logical source DTO with all the properties
	 */
	createLogicalSource(sourceFormat: string, iterator: string, tableName: string, query: string, queryName: string) {
		if (sourceFormat === 'XML' || sourceFormat === 'JSON') {
			return { iterator };
		}
		if (sourceFormat === 'MYSQL' || sourceFormat === 'POSTGRESQL') {
			if (tableName) {
				return { tableName };
			}
			if (query) {
				return { query, queryName };
			}
		}
		return {};
	}

	/**
	 * Create mapping DTO with all collected properties
	 */
	createMappingDTO(dataSourceId: number, sourceFormat: string, iterator: string, tableName: string, query: string, queryName: string, templateUrl: string, subjectClass: string, predicates: PredicateObjectMapDTO[]): void {
		this.mappingDTO = {
			name: this.mappingName,
			baseUrl: this.mappingBaseUrl,
			ontologyIds: [this.selectedSubjectOntology.id, this.selectedPredicateOntology.id],
			fields: [
				{
					dataSourceId,
					logicalSource: this.createLogicalSource(sourceFormat, iterator, tableName, query, queryName),
					subject: {
						template: templateUrl,
						className: this.selectedSubjectOntology.url + subjectClass,
					},
					predicates,
				},
			],
		};
		this.blockedSubject = true;
		if (this.query != null && this.queryName != null) {
			this.blockQuery = true;
		}
	}

	/**
	 * Add predicate DTO to field
	 */
	addPredicateToField(predicate: PredicateObjectMapDTO[]): void {
		const lastField = this.mappingDTO.fields[this.mappingDTO.fields.length - 1];
		lastField.predicates.push(...predicate);
		if (!this.mappingDTO.ontologyIds.includes(this.selectedPredicateOntology.id)) {
			this.mappingDTO.ontologyIds.push(this.selectedPredicateOntology.id);
		}
	}

	/**
	 * Add new field to mapping DTO
	 */
	addNewFieldToMapping(dataSourceId: number, sourceFormat: string, iterator: string, tableName: string, templateUrl: string, subjectClass: string, predicates: PredicateObjectMapDTO[]): void {
		this.mappingDTO.fields.push({
			dataSourceId,
			logicalSource: sourceFormat === 'XML' || sourceFormat === 'JSON' ? { iterator } : { tableName },
			subject: {
				template: templateUrl,
				className: this.selectedSubjectOntology.url + subjectClass,
			},
			predicates
		});
		[this.selectedPredicateOntology.id, this.selectedSubjectOntology.id].forEach(id => {
			if (!this.mappingDTO.ontologyIds.includes(id)) {
				this.mappingDTO.ontologyIds.push(id);
			}
		});
		this.blockedSubject = true;
	}

	/**
	 * Validate iterator from subject and data type from object
	 */
	validateMappingInputs(): boolean {
		const { currentTermType, selectedDataType, selectedSourceFormat, iterator } = this;

		if (currentTermType === 'literal' && !selectedDataType) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_ERRORS_NODATATYPE, MESSAGES_ERRORS);
			return false;
		}

		if ((selectedSourceFormat === 'XML' || selectedSourceFormat === 'JSON') && !iterator) {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_ERRORS_NOITERATOR, MESSAGES_ERRORS);
			return false;
		}

		return true;
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
		return { iconClasses, titles };
	}

	/**
	 * Retrieves the namespace map for the selected ontology
	 */
	getNamespaceMap(): void {
		this.ontologyService
			.getNameSpaceMap(this.selectedPredicateOntology.id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: Record<string, string>) => {
				this.namespaceMap = this.cleanNamespaceMap(data);
			});
	}

	/**
	 * Retrieves the data source by id
	 */
	getSourceById(id: number): void {
		this.dataSourceService
			.getDataSource(id)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((data: DataSourceDTO) => {
				this.mappingType = data.type
			})
	}

	/**
	 * Cleans the keys of the namespace map by removing trailing colons
	 */
	cleanNamespaceMap(data: Record<string, string>): Record<string, string> {
		const cleanedNamespaceMap: Record<string, string> = {};
		for (const key in data) {
			const cleanedKey = key.endsWith(':') ? key.slice(0, -1) : key;
			cleanedNamespaceMap[cleanedKey] = data[key];
		}
		return cleanedNamespaceMap;
	}

	/**
	 * Search with prefix in namespace map to return the url value
	 */
	onPropertySelect(property: string): void {
		this.selectedPredicateProperty = property;

		const splittedProperty: string[] = property.split(':');
		const prefix = splittedProperty[0];
		const propertyName = splittedProperty[1];
		const foundUrl = this.namespaceMap[prefix];

		if (foundUrl) {
			this.selectedPredicatePropertyUrl = foundUrl + propertyName;
			this.selectedNamespace = {
				prefix,
				iri: foundUrl
			}
		} else {
			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PREDICATE_INCOMPLETE, MESSAGES_ERRORS);
		}
	}

	/**
	 * Adds a namespace to the mapping if it does not already exist
	 */
	addNamespaceToMapping(namespace: NamespaceDTO): void {
		if (!this.mappingDTO.namespaces) {
			this.mappingDTO.namespaces = [];
		}
		const urlExists = this.mappingDTO.namespaces.some(existingNamespace => existingNamespace.iri && existingNamespace.iri === namespace.iri);
		if (!urlExists) {
			this.mappingDTO.namespaces?.push(namespace);
		}
	}

	/**
	 * Process query based on the term type
	 */
	search(event) {
		const fieldsToSearch = (this.selectedSourceFormat === DataFileTypeEnum.XML)
			? this.filterAndTrimFields(this.sourceFields)
			: this.sourceFields;

		const query = event.query;
		if (this.currentTermType === 'literal') {
			this.inputValue = '';
			this.executeSearch(query, fieldsToSearch);

		} else if (this.currentTermType === 'iri' && query.includes('{')) {
			const charIndex = query.lastIndexOf('{');
			if (charIndex !== -1) {
				// Get query part before { and save it in inputValue
				this.inputValue = query.substring(0, charIndex + 1).trim();
				// Get query part after { and search
				const searchText = query.substring(charIndex + 1);
				this.executeSearch(searchText, fieldsToSearch);

			}
		}
	}

	/**
	 * Filters and trims fields based on the iterator
	 */
	filterAndTrimFields(fieldsToSearch: string[]): string[] {
		return fieldsToSearch
			.filter(field => field.startsWith(this.iterator))
			.map(field => field.slice(this.iterator.length + 1));
	}

	/**
	 * Filters the list of file fields based on the provided search text
	 */
	executeSearch(searchText: string, fieldsToSearch: string[]): void {
		this.suggestions = fieldsToSearch.filter(field =>
			field.toLowerCase().includes(searchText.toLowerCase())
		);
	}

	/**
	 * Concat input value saved before with the selected option
	 */
	onSelect(event): void {
		const selectedValue = event.value;
		this.objectMapValue = this.inputValue + selectedValue;
	}

	/**
	 * Enable or disable object input
	 */
	isButtonDisabled(): boolean {

		if (this.type === 'FILE' &&
			(!this.selectedSource ||
				(this.selectedSourceFormat !== 'CSV' && !this.iterator))) {
			return true;
		}

		if (this.type === 'DATABASE' && (!this.selectedTable && !this.query)) {
			return true;
		}
		return false;
	}

	/**
	 * Clear all selected properties from object and predicate
	 */
	clearObjectPredicate(): void {
		this.objectMapValue = '';
		this.currentTermType = 'iri';
		this.selectedDataType = null;
		this.selectedPredicateOntology = null;
		this.predicateClasses = null;
		this.selectedPredicateClass = null;
		this.selectedPredicateProperty = null;
		this.selectedPredicatePropertyUrl = null;
		this.searchSources = null;
		this.searchTableNames = null;
		this.searchOntologies = null;
		this.searchSubjectClasses = null;
		this.searchPredicateClasses = null;
		this.searchPredicateOntologies = null;
		this.searchProperties = null;
	}

	/**
	 * Clear all selected properties
	 */
	newTriplesMap(): void {
		this.blockedSubject = false;
		this.selectedSourceFormat = '';
		this.selectedSource = null;
		this.selectedSubjectOntology = null;
		this.selectedSubjectClass = '';
		this.iterator = null;
		this.templateUrl = '';
		this.selectedPredicateOntology = null;
		this.predicateClasses = null;
		this.selectedPredicateClass = null;
		this.selectedPredicateProperty = null;
		this.selectedPredicatePropertyUrl = null;
		this.objectMapValue = '';
		this.currentTermType = 'iri';
		this.selectedDataType = null;
		this.selectedDb = null;
		this.dbTableNames = null;
		this.selectedTable = null;
		this.dataSources = null;
		this.query = null;
		this.queryName = null;
		this.blockTables = null;
		this.blockQuery = false;
		this.sourceFields = null;
		this.suggestions = null;
		this.isNewTriplesMap = true;
	}
}

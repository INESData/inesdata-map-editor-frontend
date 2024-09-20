import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataBaseSourceDTO, FileSourceDTO, FileSourceService, MappingDTO, MappingService, OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';
import { DataBaseTypeEnum } from 'src/app/shared/enums/database-type.enum';
import { DataFileTypeEnum } from 'src/app/shared/enums/datafile-type.enum';
import { DataSourceTypeEnum } from 'src/app/shared/enums/datasource-type.enum';
import { Output } from 'src/app/shared/models/output.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MESSAGES_ERRORS, MESSAGES_MAPPINGS_PAIRS } from 'src/app/shared/utils/app.constants';
import { mapToDataSource } from 'src/app/shared/utils/types.utils';
@Component({
	selector: 'app-mappings-builder',
	templateUrl: './mappings-builder.component.html'
})
export class MappingsBuilderComponent implements OnInit {
	destroyRef = inject(DestroyRef);

	constructor(private ontologyService: OntologyService, private fileSourceService: FileSourceService, private mappingService: MappingService, private notificationService: NotificationService, private router: Router) { }

	formats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	mapping: Output[] = [];
	mappingDTO: MappingDTO;
	mappingName = '';
	selectedFormat;
	ontologies: SearchOntologyDTO[];
	classes: string[];
	attributes: string[];

	dataSources: FileSourceDTO[] | DataBaseSourceDTO[];
	fileFields: string[];
	queryDialogVisible = false;
	elementDialogVisible = false;
	isFileType: boolean;

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

	ngOnInit() {
		this.getOntologies();
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
		const type = mapToDataSource(format);
		if (type == DataSourceTypeEnum.FILE) {
			this.isFileType = true;
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
		this.getFields(source.id)
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
			this.buildMapping();

		} else {

			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PAIRS, MESSAGES_ERRORS);
		}
	}

	/**
	* Builds the mapping fields based on the current mappings
	* and updates the mappingDTO with the generated fields.
	*/
	buildMapping(): void {

		const outputs: Output[] = this.mapping;
		const baseUrl = 'http://example.org/';

		const mappingFields = outputs.map(output => {
			const classNameUrl = `${baseUrl}${output.ontologyClass}`;
			const predicateUrl = `${baseUrl}${output.ontologyAttribute}`;

			return {
				dataSourceId: output.dataSourceId,
				ontologyId: output.ontologyId,
				predicates: [
					{
						objectMap: [
							{
								key: "rml:reference",
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
			fields: mappingFields
		};
	}

	/**
	* Generates a mapping and call the mapping service to create it.
	*/
	generateMapping(): void {
		// Validate if the mapping name is empty
		if (this.mappingName.trim() === '') {
			this.errorMessage = 'El nombre del mapping no puede estar vacío';
			return;
		}

		// Assign the mapping name and clear the error message
		this.mappingDTO.name = this.mappingName;
		this.errorMessage = '';

		this.mappingService
			.create(this.mappingDTO)
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			).subscribe((data: MappingDTO) => {
				console.log(data);
				this.router.navigate(['/mappings']);
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
}

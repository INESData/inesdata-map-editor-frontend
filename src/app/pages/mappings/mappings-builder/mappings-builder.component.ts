import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataBaseSourceDTO, FileSourceDTO, FileSourceService, OntologyService, SearchOntologyDTO } from 'projects/mapper-api-client';
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

	constructor(private ontologyService: OntologyService, private fileSourceService: FileSourceService, private notificationService: NotificationService) { }

	formats: string[] = [...Object.values(DataBaseTypeEnum), ...Object.values(DataFileTypeEnum)];
	mapping: Output[] = [];
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

		} else {

			this.notificationService.showErrorMessage(MESSAGES_MAPPINGS_PAIRS, MESSAGES_ERRORS);
		}
	}
}

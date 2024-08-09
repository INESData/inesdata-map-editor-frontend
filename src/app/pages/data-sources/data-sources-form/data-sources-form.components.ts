import { Component, OnInit } from '@angular/core';

interface Format {
	name: string;
}

@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {
	formats: Format[] | undefined;
	selectedFormato: Format | undefined;
	fileName: string = 'Ningún archivo seleccionado';
	fileSelected: boolean = false;
	file: File;

	/**
	 * Extract selected file
	 */
	onFileSelected(event) {
		this.file = event.target.files[0];
		if (this.file) {
			this.fileName = this.file.name;
			this.fileSelected = true; // File selected
		} else {
			this.fileName = 'Ningún archivo seleccionado';
			this.fileSelected = false; // No file selected
		}
	}

	ngOnInit() {
		this.formats = [{ name: 'CSV' }, { name: 'JSON' }, { name: 'BBDD' }];
	}
}

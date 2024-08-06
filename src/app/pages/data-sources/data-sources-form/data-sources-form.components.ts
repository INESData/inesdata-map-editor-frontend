import { Component, OnInit } from '@angular/core';

interface Formato {
	name: string;
}

@Component({
	selector: 'app-data-sources-form',
	templateUrl: './data-sources-form.component.html'
})
export class DataSourcesFormComponent implements OnInit {
	formatos: Formato[] | undefined;
	selectedFormato: Formato | undefined;
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
			this.fileSelected = true; // Archivo seleccionado
		} else {
			this.fileName = 'Ningún archivo seleccionado';
			this.fileSelected = false; // No hay archivo seleccionado
		}
	}

	ngOnInit() {
		this.formatos = [{ name: 'CSV' }, { name: 'JSON' }, { name: 'BBDD' }];
	}
}

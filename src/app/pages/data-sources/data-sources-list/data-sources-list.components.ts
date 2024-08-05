import { Component } from '@angular/core';

@Component({
	selector: 'app-data-sources-list',
	templateUrl: './data-sources-list.component.html'
})
export class DataSourcesListComponent {
	datasources = [
		{ fuente: 'Fuente de datos', formato: 'CSV' },
		{ fuente: 'Fuente de datos', formato: 'CSV' },
		{ fuente: 'Fuente de datos', formato: 'CSV' },
		{ fuente: 'Fuente de datos', formato: 'CSV' },
		{ fuente: 'Fuente de datos', formato: 'CSV' },
		{ fuente: 'Fuente de datos', formato: 'CSV' }
	];
	addDialogVisible: boolean = false;
	deleteDialogVisible: boolean = false;

	showDialog() {
		this.addDialogVisible = true;
	}

	showDialogDelete() {
		this.deleteDialogVisible = true;
	}
}

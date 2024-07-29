import { Component, OnInit } from '@angular/core';
import { DataBaseSourceService } from 'projects/mapper-api-client';

@Component({
	selector: 'app-mappings-configuration',
	templateUrl: './../mappings.component.html'
})
export class MappingsConfigurationComponent implements OnInit {
	constructor(private databaseSourceService: DataBaseSourceService) {}

	ngOnInit() {
		this.databaseSourceService.getTableNames(1).subscribe((data) => {
			console.log(data);
		});
	}
}

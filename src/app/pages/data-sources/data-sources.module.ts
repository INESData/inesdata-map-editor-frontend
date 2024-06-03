import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataSourcesComponent } from './data-sources.component';
import { DataSourcesFormComponent } from './data-sources-form/data-sources-form.components';
import { DataSourcesListComponent } from './data-sources-list/data-sources-list.components';
import { DataSourcesRoutingModule } from './data-sources-routing.module';

@NgModule({
	declarations: [
		DataSourcesComponent,
		DataSourcesListComponent,
		DataSourcesFormComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		DataSourcesRoutingModule
	]
})
export class DataSourcesModule { }

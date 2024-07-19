import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { OntologiesComponent } from './ontologies.component';
import { OntologiesFormComponent } from './ontologies-form/ontologies-form.component';
import { OntologiesListComponent } from './ontologies-list/ontologies-list.component';
import { OntologiesRoutingModule } from './ontologies-routing.module';

@NgModule({
	declarations: [
		OntologiesComponent,
		OntologiesListComponent,
		OntologiesFormComponent
	],
	imports: [
		CommonModule,
		ButtonModule,
		TableModule,
		FormsModule,
		OntologiesRoutingModule
	]
})
export class OntologiesModule { }

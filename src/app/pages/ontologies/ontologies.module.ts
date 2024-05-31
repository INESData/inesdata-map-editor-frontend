import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
		FormsModule,
		OntologiesRoutingModule
	]
})
export class OntologiesModule { }

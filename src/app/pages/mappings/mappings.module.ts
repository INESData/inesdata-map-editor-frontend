import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MappingsComponent } from './mappings.component';
import { MappingsConfigComponent } from './mappings-config/mappings-config.component';
import { MappingsListComponent } from './mappings-list/mappings-list.component';
import { MappingsRoutingModule } from './mappings-routing.module';

@NgModule({
	declarations: [
		MappingsComponent,
		MappingsListComponent,
		MappingsConfigComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MappingsRoutingModule
	]
})
export class MappingsModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MappingsComponent } from './mappings.component';
import { MappingsBuilderComponent } from './mappings-builder/mappings-builder.component';
import { MappingsFormComponent } from './mappings-form/mappings-form.component';
import { MappingsListComponent } from './mappings-list/mappings-list.component';
import { MappingsRecordsComponent } from './mappings-records/mappings-records.component';
import { MappingsRoutingModule } from './mappings-routing.module';

@NgModule({
	declarations: [MappingsComponent, MappingsListComponent, MappingsFormComponent, MappingsRecordsComponent, MappingsBuilderComponent],
	imports: [MappingsRoutingModule, SharedModule]
})
export class MappingsModule {}

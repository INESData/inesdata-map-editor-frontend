import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DataSourcesComponent } from './data-sources.component';
import { DataSourcesFormComponent } from './data-sources-form/data-sources-form.components';
import { DataSourcesListComponent } from './data-sources-list/data-sources-list.components';
import { DataSourcesRoutingModule } from './data-sources-routing.module';

@NgModule({
	declarations: [DataSourcesComponent, DataSourcesListComponent, DataSourcesFormComponent],
	imports: [DataSourcesRoutingModule, SharedModule]
})
export class DataSourcesModule {}

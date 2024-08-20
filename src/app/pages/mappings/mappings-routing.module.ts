import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MappingsListComponent } from './mappings-list/mappings-list.component';

const routes: Routes = [
	{
		path: '',
		component: MappingsListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MappingsRoutingModule {}

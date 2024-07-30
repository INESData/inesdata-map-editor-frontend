import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MappingsComponent } from './mappings.component';
import { MappingsFormComponent } from './mappings-form/mappings-form.component';

const routes: Routes = [
	{
		path: '',
		component: MappingsComponent,
		children: [
			{
				path: 'new',
				component: MappingsFormComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MappingsRoutingModule {}

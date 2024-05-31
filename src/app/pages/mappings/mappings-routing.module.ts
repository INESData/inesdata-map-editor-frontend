import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MappingsComponent } from './mappings.component';
import { MappingsConfigurationComponent } from './mappings-configuration/mappings-configuration.component';

const routes: Routes = [
	{
		path: '',
		component: MappingsComponent,
		children: [
			{
				path: 'configuration',
				component: MappingsConfigurationComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MappingsRoutingModule { }

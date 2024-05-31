import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MappingsComponent } from './mappings.component';
import { MappingsConfigComponent } from './mappings-config/mappings-config.component';

const routes: Routes = [
	{
		path: '',
		component: MappingsComponent,
		children: [
			{
				path: 'config',
				component: MappingsConfigComponent
			},
			{
				path: '**',
				loadChildren: () => import('./../../pages/error/error404/error404.module').then((m) => m.Error404Module)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MappingsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataSourceComponent } from './pages/data-source/data-source.component';
import { MappingsListComponent } from './pages/mappings-list/mappings-list.component';
import { OntologyComponent } from './pages/ontology/ontology.component';

// Application routes
const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'ontology',
		component: OntologyComponent,
	},
  {
		path: 'data',
		component: DataSourceComponent,
	},
  {
		path: 'mappings',
		component: MappingsListComponent,
	},
	{
		path: '403',
		loadChildren: () => import('./pages/error/error403/error403.module').then((m) => m.Error403Module)
	},
	{
		path: '**',
		loadChildren: () => import('./pages/error/error404/error404.module').then((m) => m.Error404Module)
	}
];

/**
 * App routing module
 */
@NgModule({
	imports: [RouterModule.forRoot(routes, {})],
	exports: [RouterModule]
})
export class AppRoutingModule {}

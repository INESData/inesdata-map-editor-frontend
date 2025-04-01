import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExportImportComponent } from './export-import.component';

const routes: Routes = [
	{ path: '', component: ExportImportComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})


export class ExportImportRoutingModule { }

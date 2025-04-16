import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExportImportComponent } from './export-import.component';
import { ExportImportRoutingModule } from './export-import-routing.module';


@NgModule({
	declarations: [ExportImportComponent],
	imports: [CommonModule, ExportImportRoutingModule, SharedModule]
})
export class ExportImportModule { }
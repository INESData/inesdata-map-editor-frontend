import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

/**
 * Home component module
 */
@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, HomeRoutingModule, TranslateModule]
})
export class HomeModule {}

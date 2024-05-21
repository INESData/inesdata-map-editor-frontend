import { Component } from '@angular/core';
import { MenuService } from 'src/app/shared/services/menu.service';

import { LanguageService } from '../../services/language.service';

/**
 * Header component
 */
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	/**
	 * Component constructor
	 *
	 * @param menuService Menu service
	 * @param languageService Language service
	 */
	constructor(
		public menuService: MenuService,
		public languageService: LanguageService
	) {}
}

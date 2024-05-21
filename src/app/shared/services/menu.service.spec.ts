import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { SharedTestModule } from '../shared-tests.module';
import { MenuService } from './menu.service';

describe('MenuService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [SharedTestModule, HttpClientTestingModule, LoggerTestingModule]
		})
	);

	it('should be created', () => {
		const service: MenuService = TestBed.inject(MenuService);
		expect(service).toBeTruthy();
	});
});

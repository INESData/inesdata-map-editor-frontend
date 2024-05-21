import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, of } from 'rxjs';

import { AppComponent } from './app.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';

const translations = {};
class FakeLoader implements TranslateLoader {
	getTranslation(): Observable<unknown> {
		return of(translations);
	}
}

describe('AppComponent', () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				TranslateModule.forRoot({
					loader: { provide: TranslateLoader, useClass: FakeLoader }
				}),
				LoggerTestingModule
			],
			declarations: [AppComponent, FooterComponent, HeaderComponent],
			providers: [TranslateService]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should create content div', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('.container')).not.toEqual(null);
	});
});

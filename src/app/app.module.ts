import { LOCATION_INITIALIZED } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Translation
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Logger
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataSourcesModule } from './pages/data-sources/data-sources.module';
import { OntologiesModule } from './pages/ontologies/ontologies.module';
import { GlobalErrorHandlerService } from './shared/handlers/general-error-handler.service';
import { ServerErrorInterceptor } from './shared/interceptors/server-error.interceptor';
import { ServerLoggerService } from './shared/logger/server.logger.service';
import { WriteLoggerService } from './shared/logger/writer.logger.service';
import { SpinnerService } from './shared/services/spinner.service';
import { SharedModule } from './shared/shared.module';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_NAME } from './shared/utils/app.constants';

/**
 * Ng module: App module
 */
@NgModule({
	declarations: [AppComponent],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
		SharedModule,
		OntologiesModule,
		DataSourcesModule,
		ButtonModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => {
					return new TranslateHttpLoader(http, './assets/i18n/');
				},
				deps: [HttpClient]
			}
		}),
		LoggerModule.forRoot(
			{
				serverLoggingUrl: environment.logging.apiUrl,
				level: environment.logging.logLevel,
				serverLogLevel: environment.logging.serverLogLevel,
				disableConsoleLogging: environment.logging.disableNgxLogging,
				enableSourceMaps: environment.logging.enableSourceMaps
			},
			{
				writerProvider: {
					provide: 'TOKEN_LOGGER_WRITER_SERVICE',
					useClass: WriteLoggerService
				},
				serverProvider: {
					provide: 'TOKEN_LOGGER_SERVER_SERVICE',
					useClass: ServerLoggerService
				}
			}
		)
	],
	providers: [
		TranslateService,
		SpinnerService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ServerErrorInterceptor,
			multi: true
		},
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializerFactory,
			deps: [TranslateService, Injector, NGXLogger],
			multi: true
		},
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

/**
 * App initialization factory function
 *
 * @param translateService the translate service
 * @param injector the injector
 * @param logger the logger
 * @returns a promise that resolves to null when localization is completed
 */
export function appInitializerFactory(translateService: TranslateService, injector: Injector, logger: NGXLogger) {
	return () =>
		new Promise<unknown>((resolve) => {
			const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
			locationInitialized.then(() => {
				translateService.addLangs(AVAILABLE_LANGUAGES);

				const lang = localStorage.getItem(LANGUAGE_STORAGE_NAME) ? localStorage.getItem(LANGUAGE_STORAGE_NAME) : DEFAULT_LANGUAGE;

				translateService.setDefaultLang(lang);
				translateService.use(lang).subscribe({
					next: () => {
						localStorage.setItem(LANGUAGE_STORAGE_NAME, lang);
					},
					error: (e) => {
						logger.error(e);
						logger.error(`Problem with '${lang}' language initialization.'`);
					},
					complete: () => resolve(null)
				});
			});
		});
}

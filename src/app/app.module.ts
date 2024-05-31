import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Translation
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Logger
import { LoggerModule } from 'ngx-logger';
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
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

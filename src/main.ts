import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { runtimeEnvLoader as runtimeEnvLoaderPromise } from './environments/runtimeEnvLoader';

runtimeEnvLoaderPromise.then((runtimeEnv) => {
	if (environment.production) {
		enableProdMode();
	}

	if (environment.logging.disableWindowConsoleLogging) {
		window.console.log = () => {};
		window.console.trace = () => {};
		window.console.debug = () => {};
	}

	// se agrega la configuracion cargada en runtime
	if (runtimeEnv.runtime) {
		environment.runtime = runtimeEnv.runtime;
	}

	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.catch((err) => console.error(err));
});

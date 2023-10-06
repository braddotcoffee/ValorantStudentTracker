import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Configuration values.
const CONFIG_DIALOG_INITIAL_SIZE = "40%";
const CONFIG_SERVICE_REQUEST_TIMEOUT = 10000; //ms
export { CONFIG_DIALOG_INITIAL_SIZE, CONFIG_SERVICE_REQUEST_TIMEOUT }

if (environment.production) {
    enableProdMode();
}

export function getBackendUrl(): string {
    return environment.backendUrl;
}

export function getSpreadsheetID(): string {
    return environment.spreadsheetId;
}

export function getGoogleClientID(): string {
    return environment.googleClientId;
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

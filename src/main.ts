import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

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

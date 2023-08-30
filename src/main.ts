import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

export function getSpreadsheetID(): string {
    if (environment.spreadsheetId) {
        return environment.spreadsheetId;
    }

    return "";
}

export function getGoogleClientID(): string {
    if (environment.googleClientId) {
        return environment.googleClientId;
    }

    return "";
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

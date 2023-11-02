import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Configuration values.
const CONFIG_DIALOG_INITIAL_SIZE = "40%";
const CONFIG_SERVICE_REQUEST_TIMEOUT = 2000; //ms
const STORAGE_SPREADSHEET_ID_KEY = "STUDENT_TRACKER_SPREADSHEET_ID"
const STORAGE_COACH_NAME_KEY = "STUDENT_TRACKER_COACH_NAME"
export { 
    CONFIG_DIALOG_INITIAL_SIZE, 
    CONFIG_SERVICE_REQUEST_TIMEOUT, 
    STORAGE_SPREADSHEET_ID_KEY,
    STORAGE_COACH_NAME_KEY
}

if (environment.production) {
    enableProdMode();
}

export function getBackendUrl(): string {
    return environment.backendUrl;
}

export function getGoogleClientID(): string {
    return environment.googleClientId;
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

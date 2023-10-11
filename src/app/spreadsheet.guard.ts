import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CONFIG_SERVICE_REQUEST_TIMEOUT, STORAGE_COACH_NAME_KEY, STORAGE_SPREADSHEET_ID_KEY } from 'src/main';
import { ROUTE_COACHES, ROUTE_COACH_SELECT, ROUTE_LANDING, ROUTE_STUDENT } from './app-routing.module';
import { CoachService } from './coach.service';
import { firstValueFrom, timeout } from 'rxjs';
import { displaySnackBarError } from './util/error-util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetGuard implements CanActivate {
    constructor(
        private router: Router,
        private coachService: CoachService,
        private snackBar: MatSnackBar
    ) { }

    async canActivate(
        next: ActivatedRouteSnapshot,
        _: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        switch(next.routeConfig?.path) {
            case ROUTE_LANDING:
                return this.handleRootPath();
            case ROUTE_COACH_SELECT:
                const coachName = next.paramMap.get('coach');
                if (coachName) {
                    return this.handleCoachPath(coachName);
                }

                return false;
            case ROUTE_STUDENT:
                return this.handleStudentPath();
        }

        return false;
    }

    handleRootPath(): boolean | UrlTree {
        if (localStorage.getItem(STORAGE_SPREADSHEET_ID_KEY) === null) {
            return this.router.parseUrl(ROUTE_COACHES);
        }
        
        return true;
    }

    async handleCoachPath(
        coachName: string
    ): Promise<boolean | UrlTree> {
        // If the requested coach is already stored, redirect to landing. Assume the spreadsheet id is correct.
        if (localStorage.getItem(STORAGE_COACH_NAME_KEY) === coachName
            && localStorage.getItem(STORAGE_SPREADSHEET_ID_KEY) !== null) {
            return this.router.parseUrl(ROUTE_LANDING);;
        }
        
        // Update stored data for the requested coach and then redirect to landing.
        if (await this.storeSpreadsheetIdForCoach(coachName)) {
            return this.router.parseUrl(ROUTE_LANDING);;
        }

        // We failed to update stored data for the requested coach.
        return false;
    }

    handleStudentPath(): boolean | UrlTree {
        if (localStorage.getItem(STORAGE_SPREADSHEET_ID_KEY) === null) {
            return this.router.parseUrl(ROUTE_COACHES);
        }

        return true;
    }

    async storeSpreadsheetIdForCoach(coachName: string): Promise<boolean> {
        return await firstValueFrom((await this.coachService.getCoach(coachName)).pipe(timeout(CONFIG_SERVICE_REQUEST_TIMEOUT)))
            .then(coach => {
                localStorage.setItem(STORAGE_COACH_NAME_KEY, coachName);
                localStorage.setItem(STORAGE_SPREADSHEET_ID_KEY, coach.spreadsheetId);

                return true;
            })
            // If we error the coach doesn't exist.
            .catch(_ =>  {
                displaySnackBarError(this.snackBar, "Failed to load coach...")
                return false;
            });
    }
}
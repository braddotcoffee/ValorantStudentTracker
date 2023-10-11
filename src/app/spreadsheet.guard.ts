import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { STORAGE_COACH_NAME_KEY, STORAGE_SPREADSHEET_ID_KEY } from 'src/main';
import { ROUTE_COACH_SELECT, ROUTE_LANDING, ROUTE_STUDENT } from './app-routing.module';
import { CoachService } from './coach.service';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetGuard implements CanActivate {
    constructor(
        private router: Router,
        private coachService: CoachService,
    ) { }

    async canActivate(
        next: ActivatedRouteSnapshot,
        _: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        switch(next.routeConfig?.path) {
            case ROUTE_LANDING:
                return this.handleRootPath();
            case ROUTE_STUDENT:
            case ROUTE_COACH_SELECT:
                const coachName = next.paramMap.get('coach');
                if (coachName) {
                    return this.handleCoachPath(coachName);
                }

                return false;
        }

        return false;
    }

    handleRootPath(): boolean | UrlTree {
        const coachName = localStorage.getItem(STORAGE_COACH_NAME_KEY);
        if (coachName !== null) {
            return this.router.parseUrl(ROUTE_COACH_SELECT.replace(":coach", coachName));
        }
        
        return true;
    }

    async handleCoachPath(
        coachName: string
    ): Promise<boolean | UrlTree> {
        // If the requested coach is already stored, permit navigation. Assume the spreadsheet id is correct.
        if (localStorage.getItem(STORAGE_COACH_NAME_KEY) === coachName
            && localStorage.getItem(STORAGE_SPREADSHEET_ID_KEY) !== null) {
            return true;
        }
        
        // Update stored data for the requested coach and then permit navigation].
        if (await this.coachService.loadCoach(coachName)) {
            return true;
        }

        // We failed to update stored data for the requested coach.
        return false;
    }
}
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom, timeout } from "rxjs";
import { CONFIG_SERVICE_REQUEST_TIMEOUT, STORAGE_COACH_NAME_KEY, STORAGE_SPREADSHEET_ID_KEY, getBackendUrl } from "src/main";
import { Coach } from "src/types/student";
import { displaySnackBarError } from "./util/error-util";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
  })
export class CoachService {
    activeCoach: BehaviorSubject<string>;

    constructor(
        private snackBar: MatSnackBar
    ) {
      this.activeCoach = new BehaviorSubject(localStorage.getItem(STORAGE_COACH_NAME_KEY) ?? "");
    }

    private buildGetCoachNamesUrl(): string {
        return `${getBackendUrl()}/list_coaches`;
    }

    private buildGetCoachUrl(coachName: string): string {
        return `${getBackendUrl()}/coach?name=${coachName}`;
    }

    get coach(): Observable<string> {
      return this.activeCoach;
    }

    async getCoachNames(): Promise<Observable<string[]>> {
      // TODO Remove test data
      return Promise.resolve(new Observable(obs => {
        obs.next(["Woohoojin", "Dopai", "Obli", "Brad"]);
      }));
      /* TODO Uncomment when supported by backend
        return this.httpClient
          .get(
            this.buildGetCoachNamesUrl()
          )
          .pipe(
            map((response: any) => response.coaches)
          )
      */
    }

    async getCoach(coachName: string): Promise<Observable<Coach>> {
      // TODO Remove test data
      return Promise.resolve(new Observable(obs => {
        if (coachName === "Woohoojin") {
          return obs.next({
            spreadsheetId: "1httLutCH3tj1G8aM5QjeklfvwPsOAsLGulWAQ4g8LGo"
          });
        } else if (coachName === "Dopai") {
          return obs.next({
            spreadsheetId: "13KR000AgHoG5VKtufdKxuTOV9Ixo8Aj1ZXovyPliuHE"
          });
        }
      }));
      /* TODO Uncomment when supported by backend
        return this.httpClient
          .get(
            this.buildGetCoachUrl(coachName)
          )
          .pipe(
            map((response: any) => response.coach)
          )
      */
    }

    async loadCoach(coachName: string): Promise<boolean> {
      return await firstValueFrom((await this.getCoach(coachName)).pipe(timeout(CONFIG_SERVICE_REQUEST_TIMEOUT)))
          .then(coach => {
              localStorage.setItem(STORAGE_COACH_NAME_KEY, coachName);
              localStorage.setItem(STORAGE_SPREADSHEET_ID_KEY, coach.spreadsheetId);
              
              this.activeCoach.next(coachName);

              return true;
          })
          // If we error the coach doesn't exist.
          .catch(_ =>  {
              displaySnackBarError(this.snackBar, "Failed to load coach...")
              return false;
          });
    }
}
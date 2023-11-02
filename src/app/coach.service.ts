import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom, map, timeout } from "rxjs";
import { CONFIG_SERVICE_REQUEST_TIMEOUT, STORAGE_COACH_NAME_KEY, STORAGE_SPREADSHEET_ID_KEY, getBackendUrl } from "src/main";
import { Coach } from "src/types/student";
import { displaySnackBarError } from "./util/error-util";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
export class CoachService {
    activeCoach: BehaviorSubject<string>;

    constructor(
        private httpClient: HttpClient,
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
        return this.httpClient
          .get(
            this.buildGetCoachNamesUrl()
          )
          .pipe(
            map((response: any) => response.coaches)
          )
    }

    async getCoach(coachName: string): Promise<Observable<Coach>> {
        return this.httpClient
          .get(
            this.buildGetCoachUrl(coachName)
          )
          .pipe(
            map((response: any) => response)
          )
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
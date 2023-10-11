import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { getBackendUrl } from "src/main";
import { Coach } from "src/types/student";

@Injectable({
    providedIn: 'root'
  })
export class CoachService {
    constructor(
        private httpClient: HttpClient
    ) { }

    private buildGetCoachNamesUrl(): string {
        return `${getBackendUrl()}/list_coaches`;
    }

    private buildGetCoachUrl(coachName: string): string {
        return `${getBackendUrl()}/coach?name=${coachName}`;
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
}
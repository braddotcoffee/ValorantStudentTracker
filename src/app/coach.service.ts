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
            map((response: any) => response.coach)
          )
    }
}
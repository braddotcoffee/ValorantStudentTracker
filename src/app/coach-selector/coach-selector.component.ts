import { Component, OnInit } from '@angular/core';
import { CoachService } from '../coach.service';
import { handleError } from '../util/error-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROUTE_COACH_SELECT } from '../app-routing.module';

@Component({
    selector: 'coach-selector',
    templateUrl: './coach-selector.component.html',
    styleUrls: ['./coach-selector.component.scss']
})
export class CoachSelectorComponent implements OnInit {
    loading: boolean = true;
    public coachNames: string[] = [];

    constructor(
        private coachService: CoachService,
        private snackBar: MatSnackBar
    ) { }

    async ngOnInit(): Promise<void> {
        const coachNamesObservable = await this.coachService.getCoachNames();
        coachNamesObservable.subscribe({
            next: names => {
                this.coachNames = names;
            },
            error: err => handleError(this.snackBar, err)
        });

        this.loading = false;
    }

    getRouterLinkForCoach(coachName: string): string {
        return `/${ROUTE_COACH_SELECT.replace(":coach", coachName)}`;
    }
}
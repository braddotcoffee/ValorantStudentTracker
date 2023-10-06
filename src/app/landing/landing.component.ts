import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../spreadsheet.service';
import { firstValueFrom, timeout } from 'rxjs';
import { CONFIG_SERVICE_REQUEST_TIMEOUT } from 'src/main';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class StudentLandingComponent implements OnInit {
    static readonly MIN_RR_GAINED_VALUE = 10000;
    static readonly MAX_RR_GAINED_VALUE = 500000;
    rrGainedValue: number = 10000;
    totalStudentsValue: number = 0;
    totalNotesValue: number = 0;

    constructor(private spreadsheetService: SpreadsheetService) {

    }

    async ngOnInit(): Promise<void> {
        this.rrGainedValue = Math.floor(Math.random() * (StudentLandingComponent.MAX_RR_GAINED_VALUE - StudentLandingComponent.MIN_RR_GAINED_VALUE + 1) + StudentLandingComponent.MIN_RR_GAINED_VALUE);
        this.totalStudentsValue = (await firstValueFrom((await this.spreadsheetService.instance.getStudentNames()).pipe(timeout(CONFIG_SERVICE_REQUEST_TIMEOUT)))).length;
        this.totalNotesValue = this.totalStudentsValue * 2; // TODO Update when backend supports this.
    }
}
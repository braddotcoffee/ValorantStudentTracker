import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../spreadsheet.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class StudentLandingComponent implements OnInit {
    constructor(
        public spreadsheetService: SpreadsheetService,
    ) { }

    async ngOnInit(): Promise<void> { }

    async onClickLogin() {
        await this.spreadsheetService.login();
    }
}
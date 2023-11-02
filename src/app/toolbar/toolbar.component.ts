import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../spreadsheet.service';
import { Router } from '@angular/router';
import { ROUTE_COACHES } from '../app-routing.module';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    constructor(
      public router: Router,
      public spreadsheetService: SpreadsheetService,
    ) { }

    ngOnInit(): void { }

    async onClickLogin() {
      await this.spreadsheetService.login();
    }

    shouldShowStudentSearch(): boolean {
      // Don't show on coach selection page as the student data set may change.
      return this.router.url !== `/${ROUTE_COACHES}` && 
             this.router.url !== "/";
    }

    getRouterLinkForCoachSelect(): string {
      return `/${ROUTE_COACHES}`;
    }
}
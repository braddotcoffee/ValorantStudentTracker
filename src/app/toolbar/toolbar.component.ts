import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../spreadsheet.service';
import { Router } from '@angular/router';

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
}
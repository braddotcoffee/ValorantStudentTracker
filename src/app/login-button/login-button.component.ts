import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../spreadsheet.service';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {
    constructor(
      public spreadsheetService: SpreadsheetService,
    ) { }

    async ngOnInit(): Promise<void> { }

    async onClickLogin() {
      await this.spreadsheetService.login();
    }
}
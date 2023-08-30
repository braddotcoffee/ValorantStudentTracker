import { Component, OnInit } from '@angular/core';
import { SpreadsheetEditorService } from '../spreadsheet-editor.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class StudentLandingComponent implements OnInit {
    constructor(
        public spreadsheetEditor: SpreadsheetEditorService,
    ) { }

    async ngOnInit(): Promise<void> { }

    onClickLogin() {
        this.spreadsheetEditor.login();
    }
}
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SpreadsheetService } from '../spreadsheet.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StudentCreateComponent } from '../student-create/student-create.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-student-selector',
  templateUrl: './student-selector.component.html',
  styleUrls: ['./student-selector.component.scss']
})
export class StudentSelectorComponent implements OnInit {
    studentNames: string[] = [];
    filteredStudentNames: Observable<string[]>;
    searchStudentsCtrl = new FormControl();
    loading: boolean = true;

    constructor(
        public spreadsheetService: SpreadsheetService,
        public router: Router,
        private matDialog: MatDialog,
    ) {
      this.filteredStudentNames = this.searchStudentsCtrl.valueChanges
          .pipe(
              startWith(''), map(val => this.filter(val))
          );
    }

    async ngOnInit(): Promise<void> {
        const studentNameObservable = await this.spreadsheetService.instance.getStudentNames();
        studentNameObservable.subscribe(names => {
            this.studentNames = names;
        });
      
        this.loading = false;
    }

    filter(val: string): string[] {
      return this.studentNames.filter(option =>
          option.toLowerCase().indexOf(val?.toLowerCase()) === 0);
    }

    openStudentPage(student: string) {
        this.router.navigate(['notes'], { queryParams: { student: student } });
    }

    onClickCreate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = "520px"
        dialogConfig.width = "40%";

        this.matDialog.open(StudentCreateComponent, dialogConfig);
    }
}

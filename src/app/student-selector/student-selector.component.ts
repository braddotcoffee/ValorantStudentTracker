import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SpreadsheetService } from '../spreadsheet.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '../util/error-util';
import { ROUTE_STUDENT } from '../app-routing.module';
import { STORAGE_COACH_NAME_KEY } from 'src/main';

@Component({
  selector: 'app-student-selector',
  templateUrl: './student-selector.component.html',
  styleUrls: ['./student-selector.component.scss']
})
export class StudentSelectorComponent implements OnInit {
    loading: boolean = true;
    studentNames: string[] = [];
    filteredStudentNames: Observable<string[]>;
    searchStudentsCtrl = new FormControl();

    constructor(
        public spreadsheetService: SpreadsheetService,
        public router: Router,
        private matDialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {
      this.filteredStudentNames = this.searchStudentsCtrl.valueChanges
          .pipe(
              startWith(''), map(val => this.filter(val))
          );
    }

    async ngOnInit(): Promise<void> {
        const studentNameObservable = await this.spreadsheetService.instance.getStudentNames();
        studentNameObservable.subscribe({
            next: names => {
                this.studentNames = names;
            },
            error: err => handleError(this.snackBar, err)
        });
      
        this.loading = false;
    }

    filter(val: string): string[] {
      return this.studentNames.filter(option =>
          option.toLowerCase().indexOf(val?.toLowerCase()) === 0);
    }

    getRouterLinkForStudent(studentName: string): string {
        return `/${ROUTE_STUDENT.replace(":coach", localStorage.getItem(STORAGE_COACH_NAME_KEY) ?? "").replace(":student", studentName)}`;
    }

    onClickCreate() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { };

        this.matDialog.open(StudentDialogComponent, dialogConfig);
    }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Status, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { Observable, firstValueFrom, forkJoin, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'dialog-student',
    templateUrl: './student-dialog.component.html',
    styleUrls: ['./student-dialog.component.scss'],
})
export class StudentDialogComponent implements OnInit {
    loading: boolean = false;
    studentForm: FormGroup;
    student: Student | null = null;
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        private router: Router,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<StudentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // If provided a student we are in edit mode.
        if (data.student) {
            this.student = data.student;
        }

        this.studentForm = this.formBuilder.group({
            name: [data.student?.name, [Validators.required]],
            tracker: [data.student?.tracker, [Validators.required]],
            startingRank: [data.student?.startingRank, [Validators.required]],
            rr: [data.student?.startingRR],
        });
    }

    ngOnInit(): void {
        this.dialogRef.updateSize("40%");
    }

    async onClickSubmit(): Promise<void> {
        if (!this.studentForm.valid) {
            return;
        }
        
        this.loading = true;
        if (this.student) {
            /** 
             * We need the students row in order to edit it. The field may not be present if it was fetched in read-only view.
             */
            if (!this.student?.row) {
                const editModeStudent = await firstValueFrom((await this.spreadsheetService.instance.getStudent(this.student.name)).pipe(timeout(10000)));
                this.student.row = editModeStudent.row;
            }

            this.student.name = this.studentForm.get('name')?.value;
            this.student.tracker = this.studentForm.get('tracker')?.value;
            this.student.startingRank = this.studentForm.get('startingRank')?.value;
            this.student.startingRR = this.studentForm.get('rr')?.value;
            this.student.status = "UPDATED";

            const obs = await this.spreadsheetService.instance.updateStudent(this.student);
            forkJoin(obs).subscribe({
                next: _ => {
                    this.loading = false;
                    this.dialogRef.close();
                },
                error: err => {
                    console.log(`Unexpected exception in student dialog: ${err}`);
                }
            });
        } else {
            const student: Student = {
                name: this.studentForm.get('name')?.value,
                tracker: this.studentForm.get('tracker')?.value,
                startingRank: this.studentForm.get('startingRank')?.value,
                startingRR: this.studentForm.get('rr')?.value,
                status: "NEW",
                notes: [],
            };

            const obs = await this.spreadsheetService.instance.createStudent(student)
            forkJoin(obs).subscribe({
                next: _ => {
                    this.loading = false;
                    this.dialogRef.close();
                    this.router.navigate(['notes'], { queryParams: { student: student.name } });
                },
                error: err => {
                    console.log(`Unexpected exception in student dialog: ${err}`);
                }
            });
        }
    }
}
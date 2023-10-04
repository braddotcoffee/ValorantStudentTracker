import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student, Rank } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { firstValueFrom, forkJoin, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { handleError } from '../util/error-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { shouldTrackRR } from '../util/rank-util';
import { CONFIG_DIALOG_INITIAL_SIZE, CONFIG_SERVICE_REQUEST_TIMEOUT } from 'src/main';

@Component({
    selector: 'dialog-student',
    templateUrl: './student-dialog.component.html',
    styleUrls: ['./student-dialog.component.scss'],
})
export class StudentDialogComponent implements OnInit {
    loading: boolean = false;
    studentForm: FormGroup;
    student: Student | null = null;

    shouldTrackRR = shouldTrackRR; // Exporting library function for reference in HTML
    Rank = Rank // Exporting type for reference in HTML
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        private router: Router,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<StudentDialogComponent>,
        private snackBar: MatSnackBar,
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
        this.dialogRef.updateSize(CONFIG_DIALOG_INITIAL_SIZE);
    }

    async onClickSubmit(): Promise<void> {
        if (!this.studentForm.valid) {
            return;
        }
        
        if (this.student) {
            await this.updateStudent(this.student);
        } else {
            await this.createNewStudent();
        }
    }

    private async updateStudent(student: Student): Promise<void> {
        // We need the students row in order to edit it. The field may not be present if it was fetched in read-only view.
        if (!student.row) {
            const editModeStudent = await firstValueFrom((await this.spreadsheetService.instance.getStudent(student.name)).pipe(timeout(CONFIG_SERVICE_REQUEST_TIMEOUT)));
            student.row = editModeStudent.row;
        }

        student.name = this.studentForm.get('name')?.value;
        student.tracker = this.studentForm.get('tracker')?.value;
        student.startingRank = this.studentForm.get('startingRank')?.value;
        student.startingRR = shouldTrackRR(student.startingRank) ? this.studentForm.get('rr')?.value : undefined;
        student.status = "UPDATED";

        this.loading = true;
        const obs = await this.spreadsheetService.instance.updateStudent(student);
        forkJoin(obs).subscribe({
            next: _ => {
                this.loading = false;
                this.dialogRef.close();
            },
            error: err => handleError(this.snackBar, err)
        });
    }

    private async createNewStudent(): Promise<void> {
        const student: Student = {
            name: this.studentForm.get('name')?.value,
            tracker: this.studentForm.get('tracker')?.value,
            startingRank: this.studentForm.get('startingRank')?.value,
            startingRR: this.studentForm.get('rr')?.value,
            status: "NEW",
            notes: [],
        };

        this.loading = true;
        const obs = await this.spreadsheetService.instance.createStudent(student)
        forkJoin(obs).subscribe({
            next: _ => {
                this.loading = false;
                this.dialogRef.close();
                this.router.navigate(['notes'], { queryParams: { student: student.name } });
            },
            error: err => handleError(this.snackBar, err)
        });
    }
}
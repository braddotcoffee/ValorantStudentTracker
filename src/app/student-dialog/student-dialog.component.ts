import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Status, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { forkJoin } from 'rxjs';
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
            rr: [data.student?.rr],
        });
    }

    ngOnInit(): void { }

    async onClickSubmit(): Promise<void> {
        if (!this.studentForm.valid) {
            return;
        }
        
        var startingRank: string = this.studentForm.get('rr')?.value ?
            startingRank = `${this.studentForm.get('startingRank')?.value} ${this.studentForm.get('rr')?.value}RR` :
            startingRank = this.studentForm.get('startingRank')?.value;
        
        const student: Student = {
            name: this.studentForm.get('name')?.value,
            tracker: this.studentForm.get('tracker')?.value,
            startingRank: startingRank,
            status: this.student ? "UPDATED" : "NEW",
            notes: [],
        };

        //TODO UPDATE this.student with new data
        this.loading = true;
        const obs = this.student ? 
                        await this.spreadsheetService.instance.updateStudent(this.student) :
                        await this.spreadsheetService.instance.createStudent(student);
                        
        forkJoin(obs).subscribe(_ => {
            this.loading = false;
            this.dialogRef.close();
            this.router.navigate(['notes'], { queryParams: { student: student.name } });
        });
    }
}
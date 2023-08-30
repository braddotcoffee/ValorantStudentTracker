import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/types/student';
import { SpreadsheetEditorService } from '../spreadsheet-editor.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'dialog-student-create',
    templateUrl: './student-create.component.html',
    styleUrls: ['./student-create.component.scss'],
})
export class StudentCreateComponent implements OnInit {
    createStudentForm: FormGroup;
    loading: boolean = false;
    
    constructor(
        private spreadsheetEditor: SpreadsheetEditorService,
        private router: Router,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<StudentCreateComponent>,
    ) {
        this.createStudentForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            tracker: ['', [Validators.required]],
            startingRank: ['', [Validators.required]],
            rr: ['']
        });
    }

    async ngOnInit(): Promise<void> { }

    async onClickCreate(): Promise<void> {
        if (!this.createStudentForm.valid) {
            return;
        }
        
        var startingRank: string = this.createStudentForm.get('rr')?.value ?
            startingRank = `${this.createStudentForm.get('startingRank')?.value} ${this.createStudentForm.get('rr')?.value}RR` :
            startingRank = this.createStudentForm.get('startingRank')?.value;
        
        const student: Student = {
            name: this.createStudentForm.get('name')?.value,
            tracker: this.createStudentForm.get('tracker')?.value,
            startingRank: startingRank,
            status: "NEW",
            notes: []
        };

        this.loading = true;
        const obs = await this.spreadsheetEditor.writeNewStudent(student);
        forkJoin(obs).subscribe(_ => {
            this.loading = false;
            this.dialogRef.close();
            this.router.navigate(['notes'], { queryParams: { student: student.name } });
        });
    }
}
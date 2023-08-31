import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'dialog-student-note-edit',
    templateUrl: './student-note-edit.component.html',
    styleUrls: ['./student-note-edit.component.scss'],
})
export class StudentNoteEditComponent implements OnInit {
    editNoteForm: FormGroup;
    student: Student;
    note: Note;
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<StudentNoteEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.editNoteForm = this.fb.group({
            note: [data.note.content, [Validators.required]]
        });

        this.student = data.student;
        this.note = data.note;
    }

    async ngOnInit(): Promise<void> { }

    async onClickConfirm() {
        if (!this.editNoteForm.valid) {
            return;
        }

        this.note.content = this.editNoteForm.value['note'];
        this.note.status = "UPDATED";

        const obs = await this.spreadsheetService.instance.updateStudent(this.student);
        forkJoin(obs).subscribe(_ => { });
    }
}
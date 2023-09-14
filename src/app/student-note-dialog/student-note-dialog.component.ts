import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'dialog-student-note',
    templateUrl: './student-note-dialog.component.html',
    styleUrls: ['./student-note-dialog.component.scss'],
})
export class StudentNoteDialogComponent implements OnInit {
    noteForm: FormGroup;
    student: Student;
    note: Note | null = null;
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        if (data.note) {
            this.note = data.note;
        }
        
        this.noteForm = this.formBuilder.group({
            note: [data.note?.content, [Validators.required]]
        });

        this.student = this.data.student;
    }

    async ngOnInit(): Promise<void> { }

    async onClickSubmit() {
        if (!this.noteForm.valid) {
            return;
        }

        this.student.notes.push({
            content: this.noteForm.get('note')?.value,
            date: this.note ? this.note.date : new Date(),
            status: this.note ? "UPDATED" : "NEW"
        });

        const obs = await this.spreadsheetService.instance.updateStudent(this.student);
        forkJoin(obs).subscribe(_ => { });
    }
}
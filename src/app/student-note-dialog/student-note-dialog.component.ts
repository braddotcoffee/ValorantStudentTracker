import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'dialog-student-note',
    templateUrl: './student-note-dialog.component.html',
    styleUrls: ['./student-note-dialog.component.scss'],
})
export class StudentNoteDialogComponent implements OnInit {
    loading: boolean = false;
    noteForm: FormGroup;
    student: Student;
    note: Note | null = null;
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<StudentNoteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        if (data.note) {
            this.note = data.note;
        }
        
        this.noteForm = this.formBuilder.group({
            currentrank: [data.note?.currentRank, [Validators.required]],
            rr: [data.note?.currentRR],
            note: [data.note?.content, [Validators.required]],
        });

        this.student = this.data.student;
    }

    async ngOnInit(): Promise<void> { }

    async onClickSubmit() {
        if (!this.noteForm.valid) {
            return;
        }

        if (this.note) {
            this.note.currentRank = this.noteForm.get('currentrank')?.value;
            this.note.currentRR = this.noteForm.get('rr')?.value;
            this.note.content = this.noteForm.get('note')?.value;
            this.note.status = "UPDATED";
        } else {
            this.student.notes.push({
                content: this.noteForm.get('note')?.value,
                date: new Date(),
                currentRank: this.noteForm.get('currentrank')?.value,
                currentRR: this.noteForm.get('rr')?.value,
                status: "NEW",
            });
        }

        this.loading = true;
        const obs = await this.spreadsheetService.instance.updateStudent(this.student);
        forkJoin(obs).subscribe({
            next: _ => {
                this.loading = false;
                this.dialogRef.close();
            },
            error: err => {
                console.log(`Unexpected exception in student note dialog: ${err}`);
            }
        });
    }
}
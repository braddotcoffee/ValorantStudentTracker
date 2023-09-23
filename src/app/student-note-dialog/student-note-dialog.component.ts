import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note, Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { firstValueFrom, forkJoin, pipe, timeout } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from '../util/error-util';

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
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.student = this.data.student;
        if (data.note) {
            this.note = data.note;
        }
        
        this.noteForm = this.formBuilder.group({
            currentrank: [data.note?.currentRank],
            rr: [data.note?.currentRR],
            note: [data.note?.content, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.dialogRef.updateSize("40%");
    }

    async onClickSubmit() {
        if (!this.noteForm.valid) {
            return;
        }

        if (this.note) {
            await this.updateNote(this.student, this.note);
        } else {
            await this.createNewNote(this.student);
        }
    }

    private async updateNote(student: Student, note: Note): Promise<void> {
        /** 
         * We need the notes row in order to edit it. The field may not be present if it was fetched in read-only view.
         * This assumes that a student won't have two notes made on the same day, if that happens then this will BREAK.
         */
        if (!note.row) {
            const editModeStudent = await firstValueFrom((await this.spreadsheetService.instance.getStudent(student.name)).pipe(timeout(10000)));
            const editModeNote = editModeStudent.notes.find(({ date }) => note.date.toDateString() === date.toDateString());
            note.row = editModeNote?.row;
        }
    
        note.currentRank = this.noteForm.get('currentrank')?.value;
        note.currentRR = this.noteForm.get('rr')?.value;
        note.content = this.noteForm.get('note')?.value;
        note.status = "UPDATED";

        await this.pushStudentUpdates(student);
    }

    private async createNewNote(student: Student): Promise<void> {
        student.notes.push({
            content: this.noteForm.get('note')?.value,
            date: new Date(),
            currentRank: this.noteForm.get('currentrank')?.value,
            currentRR: this.noteForm.get('rr')?.value,
            status: "NEW",
        });

        await this.pushStudentUpdates(student);
    }

    private async pushStudentUpdates(student: Student): Promise<void> {
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
}
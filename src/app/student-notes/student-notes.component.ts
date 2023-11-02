import { Component, OnInit } from '@angular/core';
import { NoStudentExistsError, SpreadsheetService } from '../spreadsheet.service';
import { Note, Student } from 'src/types/student';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StudentNoteDialogComponent } from '../student-note-dialog/student-note-dialog.component';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import { handleError } from '../util/error-util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-student-notes',
    templateUrl: './student-notes.component.html',
    styleUrls: ['./student-notes.component.scss'],
})
export class StudentNotesComponent implements OnInit {
    loading: boolean = true;
    student: Student | null = null;

    constructor(
        public spreadsheetService: SpreadsheetService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    async ngOnInit(): Promise<void> {
        this.route.params.subscribe(async (params) => {
            const observable = await this.spreadsheetService.instance.getStudent(params['student']);
            observable.subscribe({
                next: student => {
                    this.student = student;
                    this.loading = false;
                },
                error: err => handleError(this.snackBar, err)
            });
        });
    }

    onClickAddNote() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            student: this.student
        }

        this.matDialog.open(StudentNoteDialogComponent, dialogConfig);
    }

    onClickEditNote(note: Note) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            student: this.student,
            note: note
        }

        this.matDialog.open(StudentNoteDialogComponent, dialogConfig);
    }

    onClickEditStudent(student: Student) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            student: this.student
        };

        this.matDialog.open(StudentDialogComponent, dialogConfig);
    }

    getRankImagePath(): string {
        return `assets/images/rank-icons/${this.student?.startingRank.replace(/ /g,"_")}_Rank.png`
    }

    getRankText(rank: string, rr: number | undefined): string {
        return `${rank} ${rr ? rr + "RR" : ""}`
    }

    sortNotes(notes: Note[]): Note[] {
        // Sort notes reverse chronologically
        return notes.sort((a: any, b: any) => b.date - a.date);
    }
}
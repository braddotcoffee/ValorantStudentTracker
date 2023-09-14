import { Component, OnInit } from '@angular/core';
import { NoStudentExistsError, SpreadsheetService } from '../spreadsheet.service';
import { Note, Student } from 'src/types/student';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StudentNoteDialogComponent } from '../student-note-dialog/student-note-dialog.component';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';

@Component({
    selector: 'app-student-notes',
    templateUrl: './student-notes.component.html',
    styleUrls: ['./student-notes.component.scss'],
})
export class StudentNotesComponent implements OnInit {
    student: Student | null = null;
    loading: boolean = true;
    failed: boolean = false;

    constructor(
        public spreadsheetService: SpreadsheetService,
        private route: ActivatedRoute,
        private matDialog: MatDialog
    ) { }

    async ngOnInit(): Promise<void> {
        this.route.queryParams.subscribe(async (params) => {
            const observable = await this.spreadsheetService.instance.getStudent(params['student']);
            observable.subscribe({
                next: student => {
                    this.student = student;
                    this.loading = false;
                    this.failed = false;
                },
                error: err => {
                    this.loading = false;

                    if (err instanceof NoStudentExistsError) {
                        this.failed = true;
                    } else {
                        console.log(`Unexpected exception ${err}`);
                    }
                }
            });
        });
    }

    onClickAddNote() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = "520px"
        dialogConfig.width = "40%";
        dialogConfig.data = {
            student: this.student
        }

        this.matDialog.open(StudentNoteDialogComponent, dialogConfig);
    }

    onClickEditNote(note: Note) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = "520px"
        dialogConfig.width = "40%";
        dialogConfig.data = {
            student: this.student,
            note: note
        }

        this.matDialog.open(StudentNoteDialogComponent, dialogConfig);
    }

    onClickEditStudent(student: Student) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.minWidth = "520px"
        dialogConfig.width = "40%";
        dialogConfig.data = {
            student: this.student
        };

        this.matDialog.open(StudentDialogComponent, dialogConfig);
    }

    getRankImagePath(): string {
        // Some users have their RR in varying formats.
        // This way we make sure to always get the correct rank icon
        if (this.student?.startingRank.startsWith("Radiant")) {
            return "assets/images/rank-icons/Radiant_Rank.png"
        } else if (this.student?.startingRank.startsWith("Immortal 1")) {
            return "assets/images/rank-icons/Immortal_1_Rank.png"
        } else if (this.student?.startingRank.startsWith("Immortal 2")) {
            return "assets/images/rank-icons/Immortal_2_Rank.png"
        } else if (this.student?.startingRank.startsWith("Immortal 3")) {
            return "assets/images/rank-icons/Immortal_3_Rank.png"
        }

        return `assets/images/rank-icons/${this.student?.startingRank.replace(/ /g,"_")}_Rank.png`
    }

    sortNotes(notes: Note[]): Note[] {
        // Sort notes reverse chronologically
        return notes.sort((a: any, b: any) => b.date - a.date);
    }
}
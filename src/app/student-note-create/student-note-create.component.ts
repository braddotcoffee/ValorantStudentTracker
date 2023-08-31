import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from 'src/types/student';
import { SpreadsheetService } from '../spreadsheet.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'dialog-student-note-create',
    templateUrl: './student-note-create.component.html',
    styleUrls: ['./student-note-create.component.scss'],
})
export class StudentNoteCreateComponent implements OnInit {
    createNoteForm: FormGroup;
    student: Student;
    
    constructor(
        private spreadsheetService: SpreadsheetService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.createNoteForm = this.formBuilder.group({
            note: ['', [Validators.required]]
        });

        this.student = this.data.student;
    }

    async ngOnInit(): Promise<void> { }

    async onClickCreate() {
        if (!this.createNoteForm.valid) {
            return;
        }

        this.student.notes.push({
            content: this.createNoteForm.get('note')?.value,
            date: new Date(),
            status: "NEW"
        });

        const obs = await this.spreadsheetService.instance.updateStudent(this.student);
        forkJoin(obs).subscribe(_ => { });
    }
}
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Student } from 'src/types/student';
import { SpreadsheetEditorService } from '../spreadsheet-editor.service';

@Component({
  selector: 'app-student-input',
  templateUrl: './student-input.component.html',
  styleUrls: ['./student-input.component.scss']
})
export class StudentInputComponent implements OnInit {
  @Input() student: Student = {
    name: "",
    tracker: "",
    startingRank: "",
    status: "NEW",
    notes: [
      {
        content: "",
        date: new Date(),
        status: "NEW"
      }
    ]
  };

  @Output() requestCompleteEvent = new EventEmitter();

  constructor(private spreadsheetEditor: SpreadsheetEditorService) { }

  ngOnInit() {
  }

  updateStudent() {
    if (this.student.status !== "NEW") this.student.status = "UPDATED";
  }

  updateNote(event: Event, idx: number): void {
    const newNoteContent = (event.target as HTMLInputElement).value;
    this.student.notes[idx].content = newNoteContent ?? "";
  }

  addNewNote(): void {
    this.student.notes.unshift({
      content: "",
      date: new Date(),
      status: "NEW"
    });
  }

  async onSubmit() {
    if (this.student.status === "NEW") {
      const observable = await this.spreadsheetEditor.writeNewStudent(this.student);
      forkJoin(observable).subscribe(_ => this.requestCompleteEvent.emit());
      return;
    }

    const updateStudentObservable = await this.spreadsheetEditor.updateStudent(this.student);
    forkJoin(updateStudentObservable).subscribe(_ => this.requestCompleteEvent.emit());
  }

}

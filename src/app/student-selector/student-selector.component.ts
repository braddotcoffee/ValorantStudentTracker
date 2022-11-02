import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { Note, Status, Student } from 'src/types/student';
import { SpreadsheetEditorService } from '../spreadsheet-editor.service';
import { StepperFormStep } from '../stepper-forms/stepper-form-types';

const NAME_CONTROL = "name";
const TRACKER_CONTROL = "tracker";
const STARTING_RANK_CONTROL = "startingRank";
const FORM_START_INDEX = 0;
const NOTES_START_INDEX = 1;

@Component({
  selector: 'app-student-selector',
  templateUrl: './student-selector.component.html',
  styleUrls: ['./student-selector.component.scss']
})
export class StudentSelectorComponent implements OnInit {
  studentNames: string[] = [];
  selectedStudentName: string | null = null;
  selectedStudent: Student | null = null;
  loading: boolean = false;

  metadataFormGroup: FormGroup = new FormGroup({});

  steps: StepperFormStep[] = [];
  notesFormGroups: FormGroup[] = [];
  moveEvent: Subject<number> = new Subject<number>();

  constructor(
    private spreadsheetEditor: SpreadsheetEditorService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.metadataFormGroup = this.formBuilder.group({
      name: [this.selectedStudentName, Validators.required],
      tracker: [this.selectedStudent?.tracker],
      startingRank: [this.selectedStudent?.startingRank]
    });
  }

  private resetForm() {
    this.steps = [];
    this.notesFormGroups = [];
  }

  private buildFormFromStudent(student: Student) {
    this.metadataFormGroup = this.formBuilder.group({
      name: [student.name, Validators.required],
      tracker: [student.tracker],
      startingRank: [student.startingRank]
    });

    this.steps = [
      {
        formGroup: this.metadataFormGroup,
        stepLabel: "Student Info",
        inputs: [
          {
            label: "Student Name",
            controlName: NAME_CONTROL,
            placeholder: "Knower",
          },
          {
            label: "Student Tracker.gg",
            controlName: TRACKER_CONTROL,
            placeholder: "https://tracker.gg"
          },
          {
            label: "Starting Rank",
            controlName: STARTING_RANK_CONTROL,
            placeholder: "Radiant 1"
          }
        ]
      }
    ]

    student.notes.forEach(note => this.addNoteToForm(note));
  }

  createNewNote() {
    this.addNoteToForm({
      content: "",
      status: "NEW",
      date: new Date()
    })
    this.moveEvent.next(NOTES_START_INDEX);
  }

  private getStatusForWrite(status: Status): Status {
    return status === "NEW" ? "NEW" : "UPDATED";
  }

  private addNoteToForm(note: Note) {
    const currentStatus = this.getStatusForWrite(note.status);
    const newFormGroup: FormGroup = this.formBuilder.group({
      content: [note.content],
      date: [note.date],
      status: [currentStatus],
      row: [note.row]
    })
    this.notesFormGroups.unshift(newFormGroup)
    const noteLabel = `Note ${note.date.toLocaleDateString()}`;
    this.steps.splice(NOTES_START_INDEX, 0, {
      formGroup: newFormGroup,
      stepLabel: noteLabel,
      inputs: [{
        label: noteLabel,
        controlName: "content",
        placeholder: "Add some advice...",
        textarea: true
      }]
    })
  }

  private buildNewStudent(): Student {
    return {
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
  }

  async getStudents() {
    const studentNameObservable = await this.spreadsheetEditor.getAllStudents();
    studentNameObservable.subscribe(names => this.studentNames = names);
  }

  addNewStudent() {
    this.loading = true;
    this.resetForm();
    this.changeDetector.detectChanges();
    this.moveEvent.next(FORM_START_INDEX);
    this.selectedStudentName = null;
    this.selectedStudent = this.buildNewStudent();
    this.buildFormFromStudent(this.selectedStudent);
    this.loading = false;
  }

  resetStudent() {
    this.selectedStudentName = null;
    this.selectedStudent = null;
  }

  async studentSelected() {
    this.loading = true;
    this.resetForm();
    this.changeDetector.detectChanges();
    this.moveEvent.next(FORM_START_INDEX);

    if (this.selectedStudentName === null) {
      this.resetStudent()
      this.loading = false;
      return;
    }

    const observable = await this.spreadsheetEditor.getStudent(this.selectedStudentName)
    observable.subscribe(student => {
      this.selectedStudent = student;
      this.buildFormFromStudent(student);
      this.loading = false;
    });
  }

  private populateStudentModel() {
    if (this.selectedStudent === null) return;
    this.selectedStudent.status = this.getStatusForWrite(this.selectedStudent.status);
    this.selectedStudent.name = this.metadataFormGroup.get(NAME_CONTROL)?.value;
    this.selectedStudent.tracker = this.metadataFormGroup.get(TRACKER_CONTROL)?.value;
    this.selectedStudent.startingRank = this.metadataFormGroup.get(STARTING_RANK_CONTROL)?.value;
    const newNotes = this.notesFormGroups.map((noteFormGroup): Note => {
      return {
        content: noteFormGroup.get("content")?.value,
        date: noteFormGroup.get("date")?.value,
        status: noteFormGroup.get("status")?.value,
        row: noteFormGroup.get("row")?.value
      }
    })
    newNotes.reverse();
    this.selectedStudent.notes = newNotes;
  }

  async onSubmit() {
    if (this.selectedStudent === null) return;
    this.populateStudentModel()
    if (this.selectedStudent.status === "NEW") {
      const observable = await this.spreadsheetEditor.writeNewStudent(this.selectedStudent);
      forkJoin(observable).subscribe(_ => this.resetStudent());
      return;
    }

    const updateStudentObservable = await this.spreadsheetEditor.updateStudent(this.selectedStudent);
    forkJoin(updateStudentObservable).subscribe(_ => this.resetStudent());
  }
}

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Student } from 'src/types/student';
import { SpreadsheetEditorService } from '../spreadsheet-editor.service';

@Component({
  selector: 'app-student-selector',
  templateUrl: './student-selector.component.html',
  styleUrls: ['./student-selector.component.scss']
})
export class StudentSelectorComponent implements OnInit {
  studentNames: string[] = [];
  selectedStudentName: string | null = null;
  selectedStudent: Student | null = null;

  constructor(private spreadsheetEditorService: SpreadsheetEditorService) {
  }

  async ngOnInit(): Promise<void> {
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
    const studentNameObservable = await this.spreadsheetEditorService.getAllStudents();
    studentNameObservable.subscribe(names => this.studentNames = names);
  }

  addNewStudent() {
    this.selectedStudentName = null;
    this.selectedStudent = this.buildNewStudent();
  }

  resetStudent() {
    this.selectedStudentName = null;
    this.selectedStudent = null;
  }

  async studentSelected() {
    if (this.selectedStudentName === null) {
      return this.resetStudent()
    }

    const observable = await this.spreadsheetEditorService.getStudent(this.selectedStudentName)
    observable.subscribe(student => this.selectedStudent = student);
  }

}

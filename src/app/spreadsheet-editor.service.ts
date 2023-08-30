import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { getGoogleClientID, getSpreadsheetID } from 'src/main';
import { Note, Student } from 'src/types/student';

const MS_IN_SECOND = 1000;

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetEditorService {
  private readonly SPREADSHEET_ID;
  private accessToken: string | null = null;
  private authenticatedSubject: Subject<void> = new Subject();
  private client: google.accounts.oauth2.TokenClient;
  private expirationTime: number = Date.now();

  constructor(private httpClient: HttpClient) {
      this.SPREADSHEET_ID = localStorage.getItem("STUDENT_TRACKER_SPREADSHEET_ID") ?? getSpreadsheetID();

      this.client = google.accounts.oauth2.initTokenClient({
          client_id: getGoogleClientID(),
          scope: 'https://www.googleapis.com/auth/spreadsheets',
          prompt: '',
          callback: (response: google.accounts.oauth2.TokenResponse) => {
              this.expirationTime = Date.now() + (Number(response.expires_in) * MS_IN_SECOND);
              this.accessToken = response.access_token;
              this.authenticatedSubject.next();
          },
      });
  }

  private buildHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    }
  }

  private buildStudentMetadataUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values/RawStudents:append?valueInputOption=USER_ENTERED"
  }

  private buildNotesUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values/RawNotes:append?valueInputOption=USER_ENTERED"
  }

  private buildGetAllStudentNamesUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values/Students!A2:A"
  }

  private buildGetStudentUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values:batchGet"
      + "?ranges=RawStudents!A2:C&ranges=RawNotes!A2:C"
  }

  private buildUpdateStudentUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values:batchUpdate"
  }

  private async ensureAccessToken() {
    const timeUntilExpiration = this.expirationTime - Date.now();
    const promise = firstValueFrom(this.authenticatedSubject);
    if (this.accessToken === null || timeUntilExpiration < MS_IN_SECOND) {
      this.client.requestAccessToken();
    } else {
      this.authenticatedSubject.next();
    }
    return promise;
  }

  private buildStudentMetadata(student: Student) {
    return [
      student.name,
      student.tracker,
      student.startingRank
    ]
  }

  private buildNote(studentName: string, note: Note) {
    return [
      studentName,
      note.content,
      note.date.toLocaleDateString("en-US")
    ]
  }

  private writeNewNotes(studentName: string, notes: Note[]) {
    const studentNotes = notes.map(note => this.buildNote(studentName, note));

    return this.httpClient
      .post(
        this.buildNotesUrl(),
        {
          "majorDimension": "ROWS",
          "values": studentNotes
        },
        this.buildHeaders()
      )
  }

  async writeNewStudent(student: Student) {
    await this.ensureAccessToken();

    const studentMetadataWrite = this.httpClient
      .post(
        this.buildStudentMetadataUrl(),
        {
          "majorDimension": "ROWS",
          "values": [this.buildStudentMetadata(student)]
        },
        this.buildHeaders()
      )

    const notesWrite = this.writeNewNotes(student.name, student.notes);

    return Promise.all([studentMetadataWrite, notesWrite]);
  }

  async getAllStudents(): Promise<Observable<string[]>> {
    await this.ensureAccessToken();

    return this.httpClient
      .get(
        this.buildGetAllStudentNamesUrl(),
        this.buildHeaders()
      )
      .pipe(
        map((response: any) => response.values.map((array: string) => array[0]))
      )
  }

  async getStudent(studentName: string): Promise<Observable<Student>> {
    await this.ensureAccessToken();

    return this.httpClient
      .get(
        this.buildGetStudentUrl(),
        this.buildHeaders()
      )
      .pipe(
        map((response: any): Student => {
          const studentData = response.valueRanges[0].values as string[][];
          const noteData = response.valueRanges[1].values as string[][];

          let metadataRow = 2;
          let studentMetadata;

          for (let i = 0; i < studentData.length; i++) {
            const row = studentData[i]
            if (row[0] === studentName) {
              metadataRow += i;
              studentMetadata = row;
              break;
            }
          }

          if (studentMetadata === undefined) throw new NoStudentExistsError();

          const studentNotes: Note[] = [];

          for (let i = 0; i < noteData.length; i++) {
            const row = noteData[i];
            if (row[0] === studentName) {
              studentNotes.push({
                content: row[1],
                date: new Date(row[2]),
                status: "UNCHANGED",
                row: i + 2
              });
            }
          }

          return {
            name: studentMetadata[0],
            tracker: studentMetadata[1],
            startingRank: studentMetadata[2],
            status: 'UNCHANGED',
            row: metadataRow,
            notes: studentNotes
          }
        })
      )
  }

  async updateStudent(student: Student) {
    await this.ensureAccessToken();

    const updates = [];
    const newNotes: Note[] = [];
    if (student.status === "UPDATED") {
      updates.push({
        majorDimension: "ROWS",
        range: `RawStudents!A${student.row}:C`,
        values: [
          this.buildStudentMetadata(student)
        ]
      })
    }

    student.notes.forEach(note => {
      if (note.status === "NEW") {
        newNotes.push(note);
        return;
      }
      updates.push({
        majorDimension: "ROWS",
        range: `RawNotes!A${note.row}:C`,
        values: [
          this.buildNote(student.name, note)
        ]
      })
    });

    const updateRequest = this.httpClient
      .post(
        this.buildUpdateStudentUrl(),
        {
          valueInputOption: "USER_ENTERED",
          data: [
            updates
          ]
        },
        this.buildHeaders()
      )

    const newNotesRequest = this.writeNewNotes(student.name, newNotes)
    return Promise.all([updateRequest, newNotesRequest]);
  }
}

export class NoStudentExistsError extends Error {
  constructor() {
    super("Failed to find student");
    this.name = "NoStudentExistsError";
  }
}
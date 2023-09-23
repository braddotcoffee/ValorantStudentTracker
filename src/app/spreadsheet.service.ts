import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { firstValueFrom, map, Observable, Subject, timeout } from 'rxjs';
import { getBackendUrl, getGoogleClientID, getSpreadsheetID } from 'src/main';
import { Note, Student } from 'src/types/student';

const MS_IN_SECOND = 1000;

export interface ISpreadsheetService {
  /**
   * Gets a list of all student names from the spreadsheet.
   * 
   * @returns An array of student names. 
   * 
   */
  getStudentNames(): Promise<Observable<string[]>>;

  /**
   * Creates a new student on the spreadsheet.
   * 
   * @param student The student object to persist onto the spreadsheet. 
   */
  createStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]>;

  /**
   * Gets all details about a student from the spreadsheet including their name, tracker, starting rank and notes.
   * 
   * @param studentName The name of the student in the spreadsheet.
   */
  getStudent(studentName: string): Promise<Observable<Student>>;

  /**
   * Updates data about a student in the spreadsheet.
   * 
   * @param student The updated student object to persist.
   */
  updateStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]>;
}

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetService {
  constructor (
    private spreadsheetReaderService: SpreadsheetReaderService,
    private spreadsheetEditorService: SpreadsheetEditorService
  ) { }

  public get instance(): ISpreadsheetService {
    if (this.spreadsheetEditorService.hasLoggedIn()) {
      if (!this.spreadsheetEditorService.isLoggedIn()) this.spreadsheetEditorService.login();
      return this.spreadsheetEditorService;
    }
    
    else return this.spreadsheetReaderService;
  }

  public async login(): Promise<void> {
      await this.spreadsheetEditorService.login();
  }

  public isReadOnly() {
    return !this.spreadsheetEditorService.isLoggedIn();
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetReaderService implements ISpreadsheetService {
  constructor(
    private httpClient: HttpClient
  ) { }

  private buildGetStudentNamesUrl(): string {
    return `${getBackendUrl()}/list_students`;
  }

  private buildGetStudentUrl(studentName: string): string {
    return `${getBackendUrl()}/student?name=${studentName}`;
  }

  async getStudentNames(): Promise<Observable<string[]>> {
    return this.httpClient
      .get(
        this.buildGetStudentNamesUrl()
      )
      .pipe(
        map((response: any) => response.students)
      )
  }

  async createStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]> {
    throw new UnauthorizedOperationError()
  }

  async getStudent(studentName: string): Promise<Observable<Student>> {
    return this.httpClient
    .get(
      this.buildGetStudentUrl(studentName)
    )
    .pipe(
      map((response: any): Student => {
        response.notes.forEach((note: Note) =>  note.date = moment(note.date).toDate());

        return response;
      })
    )
  }

  async updateStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]> {
    throw new UnauthorizedOperationError()
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetEditorService implements ISpreadsheetService {
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
      + "?ranges=RawStudents!A2:D&ranges=RawNotes!A2:E"
  }

  private buildUpdateStudentUrl(): string {
    return "https://sheets.googleapis.com/v4/spreadsheets/"
      + this.SPREADSHEET_ID
      + "/values:batchUpdate"
  }

  public async login(): Promise<void> {
      await this.ensureAccessToken();
  }

  public isLoggedIn(): boolean {
      const timeUntilExpiration = this.expirationTime - Date.now();
      if (timeUntilExpiration < MS_IN_SECOND) {
          return false;
      }
      
      return true;
  }

  public hasLoggedIn(): boolean {
    return this.accessToken !== null;
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
      student.startingRank,
      student.startingRR
    ]
  }

  private buildNote(studentName: string, note: Note) {
    return [
      studentName,
      note.content,
      note.date.toLocaleDateString("en-US"),
      note.currentRank,
      note.currentRR
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

  async createStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]> {
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

  async getStudentNames(): Promise<Observable<string[]>> {
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
                currentRank: row[3],
                currentRR: row[4] ? Number(row[4]) : undefined,
                status: "UNCHANGED",
                row: i + 2
              });
            }
          }

          return {
            name: studentMetadata[0],
            tracker: studentMetadata[1],
            startingRank: studentMetadata[2],
            startingRR: studentMetadata[3] ? Number(studentMetadata[3]) : undefined,
            status: 'UNCHANGED',
            row: metadataRow,
            notes: studentNotes
          }
        })
      )
  }

  async updateStudent(student: Student): Promise<[Observable<Object>, Observable<Object>]> {
    await this.ensureAccessToken();

    const updates = [];
    const newNotes: Note[] = [];
    if (student.status === "UPDATED") {
      updates.push({
        majorDimension: "ROWS",
        range: `RawStudents!A${student.row}:D`,
        values: [
          this.buildStudentMetadata(student)
        ]
      })
    }

    student.notes.forEach(note => {
      if (note.status === "NEW") {
        newNotes.push(note);
        return;
      } else if (note.status === "UPDATED") {
        updates.push({
          majorDimension: "ROWS",
          range: `RawNotes!A${note.row}:E`,
          values: [
            this.buildNote(student.name, note)
          ]
        })
      }
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

export class UnauthorizedOperationError extends Error {
  constructor() {
    super("Unauthorized operation");
    this.name = "UnauthorizedOperationError";
  }
}

export class NoStudentExistsError extends Error {
  constructor() {
    super("Failed to find student");
    this.name = "NoStudentExistsError";
  }
}
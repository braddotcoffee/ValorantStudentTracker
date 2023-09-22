import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentSelectorComponent } from './student-selector/student-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatDialogModule } from '@angular/material/dialog';;
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentNotesComponent } from './student-notes/student-notes.component';
import { StudentLandingComponent } from './landing/landing.component';
import { StudentNoteDialogComponent } from './student-note-dialog/student-note-dialog.component';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { LoginButtonComponent } from './login-button/login-button.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginButtonComponent,
    StudentDialogComponent,
    StudentNoteDialogComponent,
    StudentNotesComponent,
    StudentSelectorComponent,
    StudentLandingComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

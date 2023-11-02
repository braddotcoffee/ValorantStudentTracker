import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentNotesComponent } from './student-notes/student-notes.component';
import { StudentLandingComponent } from './landing/landing.component';
import { CoachSelectorComponent } from './coach-selector/coach-selector.component';
import { SpreadsheetGuard } from './spreadsheet.guard';

const ROUTE_LANDING = "";
const ROUTE_COACHES = "coaches";
const ROUTE_COACH_SELECT = "coach/:coach";
const ROUTE_STUDENT = "coach/:coach/student/:student";
const routes: Routes = [
    {
      path: ROUTE_LANDING,
      component: CoachSelectorComponent,
      canActivate: [SpreadsheetGuard]
    },
    {
      path: ROUTE_COACHES,
      component: CoachSelectorComponent,
    },
    {
      path: ROUTE_STUDENT,
      component: StudentNotesComponent,
      canActivate: [SpreadsheetGuard]
    },
    {
      path: ROUTE_COACH_SELECT,
      component: StudentLandingComponent,
      canActivate: [SpreadsheetGuard]
    },
];
export { 
    ROUTE_LANDING, 
    ROUTE_COACHES,
    ROUTE_STUDENT,
    ROUTE_COACH_SELECT
}

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

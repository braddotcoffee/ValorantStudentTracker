import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentNotesComponent } from './student-notes/student-notes.component';
import { StudentLandingComponent } from './landing/landing.component';

const routes: Routes = [
    {
      path: "",
      component: StudentLandingComponent,
    },
    {
      path: "notes",
      component: StudentNotesComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

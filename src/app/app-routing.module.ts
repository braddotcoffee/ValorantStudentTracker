import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSelectorComponent } from './student-selector/student-selector.component';

const routes: Routes = [
  {
    path: "",
    component: StudentSelectorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

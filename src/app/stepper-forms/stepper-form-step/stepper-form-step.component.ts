import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperFormInput } from '../stepper-form-types';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stepper-form-step',
  templateUrl: './stepper-form-step.component.html',
  styleUrls: ['./stepper-form-step.component.scss']
})
export class StepperFormStepComponent implements OnInit {
  @Input() inputs: StepperFormInput[] = [];
  @Input() formGroup = new FormGroup({});
  @Output() newNoteEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}

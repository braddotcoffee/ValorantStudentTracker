import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperFormInput } from '../stepper-form-types';

@Component({
  selector: 'app-stepper-form-step',
  templateUrl: './stepper-form-step.component.html',
  styleUrls: ['./stepper-form-step.component.scss']
})
export class StepperFormStepComponent implements OnInit {
  @Input() inputs: StepperFormInput[] = [];
  @Input() formGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
  }

}

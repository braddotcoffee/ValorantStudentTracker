import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperFormInput } from '../stepper-form-types';

@Component({
  selector: 'app-stepper-form-input',
  templateUrl: './stepper-form-input.component.html',
  styleUrls: ['./stepper-form-input.component.scss']
})
export class StepperFormInputComponent implements OnInit {
  @Input() stepperInput!: StepperFormInput;
  @Input() formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}

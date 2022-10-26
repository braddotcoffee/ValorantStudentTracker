import { Output } from '@angular/core';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperFormStep } from '../stepper-form-types';

interface Preview {
  name: string;
  value: string;
}

@Component({
  selector: 'app-stepper-form',
  templateUrl: './stepper-form.component.html',
  styleUrls: ['./stepper-form.component.scss']
})
export class StepperFormComponent implements OnInit {
  @Input() steps: StepperFormStep[] = [];
  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  displayedColumns: string[] = ['property', 'value'];

  constructor() { }

  ngOnInit(): void {
  }

  emitSubmit(): void {
    this.submitEvent.emit();
  }

  buildReviewStructure(): Preview[] {
    const previews: Preview[] = [];
    this.steps.forEach((step) => {
      step.inputs.forEach((input) => {
        previews.push(
          {
            name: input.label,
            value: step.formGroup.get(input.controlName)?.value
          }
        );
      });
    });
    return previews;
  }
}

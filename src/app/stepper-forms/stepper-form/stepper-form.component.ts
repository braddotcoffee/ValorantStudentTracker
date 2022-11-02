import { Output, ViewChild } from '@angular/core';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
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
  @Input()
  moveEvent!: Observable<number>;
  @Output() newNoteEvent: EventEmitter<void> = new EventEmitter();
  @Output() submitEvent: EventEmitter<void> = new EventEmitter();
  displayedColumns: string[] = ['property', 'value'];
  @ViewChild('stepper') stepper!: MatStepper;

  constructor() { }

  ngOnInit(): void {
    this.moveEvent.subscribe((index: number) => this.onMoveEvent(index))
  }

  onMoveEvent(index: number) {
    this.stepper.selectedIndex = index;
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

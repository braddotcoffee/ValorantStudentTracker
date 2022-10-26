import { FormGroup } from '@angular/forms';

export interface StepperFormInput {
    label: string;
    controlName: string;
    placeholder: string;
}

export interface StepperFormStep {
    formGroup: FormGroup;
    stepLabel: string;
    inputs: StepperFormInput[];
}

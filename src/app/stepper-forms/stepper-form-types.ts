import { FormArray, FormGroup } from '@angular/forms';

export interface StepperFormInput {
    label: string;
    controlName: string;
    placeholder: string;
    textarea?: boolean;
}

export interface StepperFormStep {
    formGroup: FormGroup;
    stepLabel: string;
    inputs: StepperFormInput[];
}

export interface StepperFormArray {
    date: string;
    controlName: string;
    placeholder: string;
}
export interface StepperFormArrayStep {
    formArray: FormArray;
    stepLabel: string;
    input: StepperFormArray;
}
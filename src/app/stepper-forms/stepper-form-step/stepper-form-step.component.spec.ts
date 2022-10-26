import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormStepComponent } from './stepper-form-step.component';

describe('StepperFormStepComponent', () => {
  let component: StepperFormStepComponent;
  let fixture: ComponentFixture<StepperFormStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperFormStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperFormStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

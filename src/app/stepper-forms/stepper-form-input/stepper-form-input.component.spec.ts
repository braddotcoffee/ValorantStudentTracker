import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormInputComponent } from './stepper-form-input.component';

describe('StepperFormInputComponent', () => {
  let component: StepperFormInputComponent;
  let fixture: ComponentFixture<StepperFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperFormInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

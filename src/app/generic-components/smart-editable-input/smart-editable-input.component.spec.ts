import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartEditableInputComponent } from './smart-editable-input.component';

describe('SmartEditableInputComponent', () => {
  let component: SmartEditableInputComponent;
  let fixture: ComponentFixture<SmartEditableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartEditableInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartEditableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

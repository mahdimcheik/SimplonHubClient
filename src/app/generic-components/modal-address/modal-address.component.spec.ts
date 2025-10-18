import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddressComponent } from './modal-address.component';

describe('ModalAddressComponent', () => {
  let component: ModalAddressComponent;
  let fixture: ComponentFixture<ModalAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

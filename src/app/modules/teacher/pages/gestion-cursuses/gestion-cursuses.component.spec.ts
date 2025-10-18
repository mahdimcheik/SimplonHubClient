import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCursusesComponent } from './gestion-cursuses.component';

describe('GestionCursusesComponent', () => {
  let component: GestionCursusesComponent;
  let fixture: ComponentFixture<GestionCursusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCursusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCursusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

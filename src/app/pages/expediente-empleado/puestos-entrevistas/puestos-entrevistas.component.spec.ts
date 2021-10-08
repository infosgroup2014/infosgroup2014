import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestosEntrevistasComponent } from './puestos-entrevistas.component';

describe('PuestosEntrevistasComponent', () => {
  let component: PuestosEntrevistasComponent;
  let fixture: ComponentFixture<PuestosEntrevistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestosEntrevistasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuestosEntrevistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

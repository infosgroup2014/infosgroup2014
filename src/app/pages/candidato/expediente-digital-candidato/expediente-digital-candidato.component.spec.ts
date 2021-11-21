import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteDigitalCandidatoComponent } from './expediente-digital-candidato.component';

describe('ExpedienteDigitalCandidatoComponent', () => {
  let component: ExpedienteDigitalCandidatoComponent;
  let fixture: ComponentFixture<ExpedienteDigitalCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpedienteDigitalCandidatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedienteDigitalCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramarDeduccionesComponent } from './programar-deducciones.component';

describe('ProgramarDeduccionesComponent', () => {
  let component: ProgramarDeduccionesComponent;
  let fixture: ComponentFixture<ProgramarDeduccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramarDeduccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarDeduccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

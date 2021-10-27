import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparacionAcademicaCanComponent } from './preparacion-academica.component';

describe('PreparacionAcademicaComponent', () => {
  let component: PreparacionAcademicaCanComponent;
  let fixture: ComponentFixture<PreparacionAcademicaCanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparacionAcademicaCanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparacionAcademicaCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

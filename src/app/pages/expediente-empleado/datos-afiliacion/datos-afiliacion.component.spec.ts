import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAfiliacionComponent } from './datos-afiliacion.component';

describe('DatosAfiliacionComponent', () => {
  let component: DatosAfiliacionComponent;
  let fixture: ComponentFixture<DatosAfiliacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosAfiliacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosAfiliacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

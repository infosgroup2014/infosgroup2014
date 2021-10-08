import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarHXComponent } from './cargar-hx.component';

describe('CargarHXComponent', () => {
  let component: CargarHXComponent;
  let fixture: ComponentFixture<CargarHXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarHXComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarHXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

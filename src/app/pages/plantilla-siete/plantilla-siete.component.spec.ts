import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaSieteComponent } from './plantilla-siete.component';

describe('PlantillaSieteComponent', () => {
  let component: PlantillaSieteComponent;
  let fixture: ComponentFixture<PlantillaSieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaSieteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaSieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

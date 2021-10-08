import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaSeisComponent } from './plantilla-seis.component';

describe('PlantillaSeisComponent', () => {
  let component: PlantillaSeisComponent;
  let fixture: ComponentFixture<PlantillaSeisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaSeisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaSeisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

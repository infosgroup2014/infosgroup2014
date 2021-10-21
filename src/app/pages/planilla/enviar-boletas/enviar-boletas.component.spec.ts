import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarBoletasComponent } from './enviar-boletas.component';

describe('EnviarBoletasComponent', () => {
  let component: EnviarBoletasComponent;
  let fixture: ComponentFixture<EnviarBoletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarBoletasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviarBoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

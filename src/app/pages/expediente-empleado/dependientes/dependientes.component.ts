import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dependientes',
  templateUrl: './dependientes.component.html',
  styleUrls: ['./dependientes.component.css']
})
export class DependientesComponent implements OnInit {
  dependienteForm!: FormGroup;
  nacimiento: NgbDateStruct;
  listaDependientes = [{ nombreDependiente: 'Francisco Gonzalez', edadDependiente: '48', sexoDependiente: 'Masculino', parentescoDependiente: 'Padre' },
  { nombreDependiente: 'Maria Gonzalez', edadDependiente: '45', sexoDependiente: 'Femenino', parentescoDependiente: 'Madre' },
  ];

  listaParentescos = [
    { nombreParentesco: '--Seleccione--', codigoParentesco: '' },
    { nombreParentesco: 'hijo(a)', codigoParentesco: '1' },
    { nombreParentesco: 'padre', codigoParentesco: '2' },
    { nombreParentesco: 'madre', codigoParentesco: '3' },
    { nombreParentesco: 'esposo', codigoParentesco: '4' },
    { nombreParentesco: 'esposa', codigoParentesco: '5' }
  ];


  listaSexo = [
    { sexoParentesco: '--Seleccione--', codigoSexo: '' },
    { sexoParentesco: 'Femenino', codigoSexo: 'F' },
    { sexoParentesco: 'Masculino', codigoSexo: 'M' }
  ];

  constructor(private fb: FormBuilder) { }

  validationMessages: { [x: string]: any; } = {
    'nombre': {
      'required': 'El nombre es requerido',
      'maxlength': 'Solo se permiten 50 caracteres para el campo nombre'
    },
    'codParentesco': {
      'required': 'El campo parentesco es requerido',
    },
  };

  formErrors: { [x: string]: any; } = {
    'nombre': '',
    'codParentesco': ''
  };

  ngOnInit(): void {
    this.dependienteForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codDependiente: [''],
      codParentesco: ['', Validators.required],
      fechaNacimiento: [''],
      nombre: ['', Validators.required],
      sexo: [''],
      identidad: [''],
      dependiente: ['']
    })
  }


  get codCia() { return this.dependienteForm.get('codCia'); }
  get codEmp() { return this.dependienteForm.get('codEmp'); }
  get codDependiente() { return this.dependienteForm.get('codDependiente'); }
  get codParentesco() { return this.dependienteForm.get('codParentesco'); }
  get fechaNacimiento() { return this.dependienteForm.get('fechaNacimiento'); }
  get nombre() { return this.dependienteForm.get('nombre'); }
  get sexo() { return this.dependienteForm.get('sexo'); }
  get identidad() { return this.dependienteForm.get('identidad'); }
  get dependiente() { return this.dependienteForm.get('dependiente'); }

  onSubmit(): void {
    console.log(this.dependienteForm);
  }

  logValidationError(group: FormGroup = this.dependienteForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {


        for (const errorKey in abstractControl.errors) {
          const messages = this.validationMessages[key];

          console.log(key + ':' + errorKey);
          this.formErrors[key] += messages[errorKey] + ' ';

        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);

      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationError(control);
          }

        }


      }

    });
  }


}

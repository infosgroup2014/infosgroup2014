import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})
export class BeneficiarioComponent implements OnInit {

  beneficiarioForm!: FormGroup;


  listaBeneficiario = [{ nombreBeneficiario: 'Francisco Gonzalez', parentescoBeneficiario: 'Padre', porcentajeBeneficiario : '50'},
  { nombreBeneficiario: 'Maria Gonzalez', parentescoBeneficiario: 'Madre', porcentajeBeneficiario : '50'},
  ];

  listaParentescos = [
    { nombreParentesco: '--Seleccione--', codigoParentesco: '' },
    { nombreParentesco: 'hijo(a)', codigoParentesco: '1' },
    { nombreParentesco: 'padre', codigoParentesco: '2' },
    { nombreParentesco: 'madre', codigoParentesco: '3' },
    { nombreParentesco: 'esposo', codigoParentesco: '4' },
    { nombreParentesco: 'esposa', codigoParentesco: '5' }
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
     'porcentaje':{
       'required':'El campo de porcentaje es requerido',
       'max':'El maximo valor a asignar es 100%',
       'min':'El minimo valor a asignar es 1%'
     }
  };

  formErrors: { [x: string]: any; } = {
    'nombre': '',
    'codParentesco': ''
  };

  ngOnInit(): void {
    this.beneficiarioForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codBeneficiario: [''],
      codParentesco: ['', Validators.required],
      porcentaje: ['',[Validators.required,Validators.min(1),Validators.max(100)]],
      nombre: ['', Validators.required],
      codEmpAnterior: [''],
      identidad: [''],
      numIgss: ['']
    })
  }

  get codCia() { return this.beneficiarioForm.get('codCia'); }
  get codEmp() { return this.beneficiarioForm.get('codEmp'); }
  get codBeneficiario() { return this.beneficiarioForm.get('codBeneficiario'); }
  get codParentesco() { return this.beneficiarioForm.get('codParentesco'); }
  get porcentaje() { return this.beneficiarioForm.get('porcentaje'); }
  get nombre() { return this.beneficiarioForm.get('nombre'); }
  get codEmpAnterior() { return this.beneficiarioForm.get('codEmpAnterior'); }
  get identidad() { return this.beneficiarioForm.get('identidad'); }
  get numIgss() { return this.beneficiarioForm.get('numIgss'); }


  onSubmit(): void {
    console.log(this.beneficiarioForm);
  }

  logValidationError(group: FormGroup = this.beneficiarioForm): void {
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

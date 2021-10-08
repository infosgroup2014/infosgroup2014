import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { max } from 'rxjs/operators';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})

export class ExperienciaLaboralComponent implements OnInit {
  experienciaLaboralForm: FormGroup;
  listaParentescos=[];
  listaSexo=[];
  dependienteForm:FormGroup;

  listaExperiencia = [{ lugarTraExp: 'Lugar de trabajo 1',
  puestoExp: 'Puesto 1', sueldoIniExp: '1000', sueldoFinExp: '1200', fechaIniExp:'01/01/2019',
  fechaFinExp:'01/12/2020',motivoRetExp:'',empleoActExp:'',extranjeroExp:'',paisExt:'',
  ocupacionExp:'' },
  { lugarTraExp: 'Lugar de trabajo 2',
  puestoExp: 'Puesto 2', sueldoIniExp: '900', sueldoFinExp: '1100', fechaIniExp:'01/01/2017',
  fechaFinExp:'01/12/2020',motivoRetExp:'',empleoActExp:'',extranjeroExp:'',paisExt:'',
  ocupacionExp:'' }
  ];

  listaPuestos = [
    { nombrePuesto: '--Seleccione--', codigoPuesto: '' },
    { nombrePuesto: 'Administrador de cartera', codigoPuesto: '1' },
    { nombrePuesto: 'Analista de nomina', codigoPuesto: '2' },
    { nombrePuesto: 'Auxiliar', codigoPuesto: '3' },
    { nombrePuesto: 'Director de finanzas', codigoPuesto: '4' },
    { nombrePuesto: 'Cobrador', codigoPuesto: '5' }
  ];





  constructor(private fb: FormBuilder) { }

  validationMessages: { [x: string]: any; } = {
    'lugarTrabajo': {
      'required': 'El nombre es requerido',
      'maxlength': 'Solo se permiten 50 caracteres para el campo nombre'
    },
    'fechaInicio': {
      'required': 'El campo parentesco es requerido',
    },
    'fechaFin': {
      'required': 'El campo parentesco es requerido',
    },
  };

  formErrors: { [x: string]: any; } = {
    'lugarTrabajo': '',
    'fechaInicio': '',
    'fechaFin': ''
  };

  ngOnInit(): void {
    this.experienciaLaboralForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codExpLaboral: [''],
      lugarTrabajo: ['', Validators.required,Validators.maxLength(50)],
      codPuesto: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      motivoRetiro: [''],
      posicionPuesto: [''],
      jefeInmediato: [''],
      autorizoInfo: [''],
      currentJob: [''],
      sueldoInicial: [''],
      sueldoFinal: [''],
      trabajoExtranjero: [''],
      paisExtrajero: [''],
      ocupacion: ['']
    })
  }



  get codCia() { return this.experienciaLaboralForm.get('codCia'); }
  get codEmp() { return this.experienciaLaboralForm.get('codEmp'); }
  get codExpLaboral() { return this.experienciaLaboralForm.get('codExpLaboral'); }
  get lugarTrabajo() { return this.experienciaLaboralForm.get('lugarTrabajo'); }
  get codPuesto() { return this.experienciaLaboralForm.get('codPuesto'); }
  get fechaInicio() { return this.experienciaLaboralForm.get('fechaInicio'); }
  get fechaFin() { return this.experienciaLaboralForm.get('fechaFin'); }
  get motivoRetiro() { return this.experienciaLaboralForm.get('motivoRetiro'); }
  get posicionPuesto() { return this.experienciaLaboralForm.get('posicionPuesto'); }
  get jefeInmediato() { return this.experienciaLaboralForm.get('jefeInmediato'); }
  get autorizoInfo() { return this.experienciaLaboralForm.get('autorizoInfo'); }
  get currentJob() { return this.experienciaLaboralForm.get('currentJob'); }
  get sueldoInicial() { return this.experienciaLaboralForm.get('sueldoInicial'); }
  get sueldoFinal() { return this.experienciaLaboralForm.get('sueldoFinal'); }
  get trabajoExtranjero() { return this.experienciaLaboralForm.get('trabajoExtranjero'); }
  get paisExtrajero() { return this.experienciaLaboralForm.get('paisExtrajero'); }
  get ocupacion() { return this.experienciaLaboralForm.get('ocupacion'); }

  onSubmit(): void {
    console.log(this.experienciaLaboralForm);
  }


  logValidationError(group: FormGroup = this.experienciaLaboralForm): void {
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

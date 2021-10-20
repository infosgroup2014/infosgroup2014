import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { max } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { AcademicaService } from '../../servicio/prepAcademica.service';
import { dependienteXEmpPK } from '../modelo/DependientesPK';
import { Dependientes } from '../modelo/Dependietnes';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import Swal from "sweetalert2";
import { Experiencias } from '../modelo/Experiencia';
import { expLaboralEmpleadoPK } from '../modelo/ExperenciaPK';



@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]

})

export class ExperienciaLaboralComponent implements OnInit {
  experienciaLaboralForm: FormGroup;
  listaParentescos=[];
  listaSexo=[];
  dependienteForm:FormGroup;

  EmpleadoSelec : dependienteXEmpPK = new dependienteXEmpPK;

  listaExperiencia = [];

  listaPuestos = [];

  listaOcupaciones = [];





  constructor(  private fb: FormBuilder,
    private router: ActivatedRoute,
    private _router : Router,
    private serviciosExpediente : AcademicaService
    )
    {

    this.router.paramMap.subscribe( params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodEmp = +params.get('codEmp');
      console.log('Empleado:'+CodCia+'-'+CodEmp);
        this.EmpleadoSelec.codCia = CodCia;
        this.EmpleadoSelec.codEmp = CodEmp;
//        console.log('Empselect:'+this.EmpleadoSelec.codCia);


      this.serviciosExpediente.obtenerExperiencias (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaExperiencia = data;
       console.log(this.listaExperiencia);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });




   }

  validationMessages: { [x: string]: any; } = {
    'lugarTrabajo': {
      'required': 'El campo es requerido',
      'maxlength': 'Solo se permiten 50 caracteres para el campo nombre'
    },
    'fechaInicio': {
      'required': 'El campo parentesco es requerido',
    },
    'fechaFin': {
      'required': 'El campo parentesco es requerido',
    },
    'motivoRetiro': {
      'required': 'El campo es requerido',
    }
  };

  formErrors: { [x: string]: any; } = {
    'lugarTrabajo': '',
    'fechaInicio': '',
    'fechaFin': '',
    'motivoRetiro': ''
  };

  ngOnInit(): void {
    this.experienciaLaboralForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codExpLaboral: [''],
      lugarTrabajo: ['', [Validators.required,Validators.maxLength(50)]],
      codPuesto: [''],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      motivoRetiro: ['', [Validators.required]],
      jefeInmediato: [''],
      autorizoInfo: [''],
      currentJob: [''],
      sueldoInicial: [''],
      sueldoFinal: [''],
      trabajoExtranjero: [''],
      paisExtrajero: [''],
      codOcupacion: ['']
    });

    this.serviciosExpediente.obtenerPuestos (this.EmpleadoSelec.codCia).subscribe((data) => {

      this.listaPuestos = data;
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });


     this.serviciosExpediente.obtenerOcupaciones (this.EmpleadoSelec.codCia).subscribe((data) => {

      this.listaOcupaciones = data;
      console.log('ocupaciones');
      console.log(this.listaOcupaciones);
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });
  }



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



  agregarExperiencia ()
  {
    console.log('agregar experiencia');

    console.log(this.experienciaLaboralForm);


    let experiencia : Experiencias = new Experiencias();
       experiencia.expLaboralEmpleadoPK = new expLaboralEmpleadoPK();


        experiencia.expLaboralEmpleadoPK.codCia = this.EmpleadoSelec.codCia;
        experiencia.expLaboralEmpleadoPK.codEmp = this.EmpleadoSelec.codEmp;

        experiencia.lugarTrabajo = this.experienciaLaboralForm.get('lugarTrabajo').value;
        experiencia.motivoRetiro = this.experienciaLaboralForm.get('motivoRetiro').value;
        experiencia.codPuesto = this.experienciaLaboralForm.get('codPuesto').value;
        experiencia.codOcupacion = this.experienciaLaboralForm.get('codOcupacion').value;



        experiencia.sueldoInicial = this.experienciaLaboralForm.get('sueldoInicial').value;
        experiencia.sueldoFinal = this.experienciaLaboralForm.get('sueldoFinal').value;


        let fechainicio = this.experienciaLaboralForm.get('fechaInicio').value

        experiencia.fechaInicio =
         String(
          fechainicio.day + '/' + fechainicio.month + '/' + fechainicio.year
        );


        let fechaFin = this.experienciaLaboralForm.get('fechaFin').value;

        experiencia.fechaFin =
         String(
          fechaFin.day + '/' + fechaFin.month + '/' + fechaFin.year
        );

       this.serviciosExpediente.guardarExperiencia(experiencia).subscribe(
        datos => {
          if (datos.expLaboralEmpleadoPK.codExpLaboral) {


            Swal.fire('Guardar Candidato',
              'Datos Guardados con exito!',
              'success');

              this.limpiar();


          } else {
            Swal.fire('Guardar Candidato',
              'Error al Guardar',
              'error');
          }
        }
      );



  }

  limpiar() {
    this.experienciaLaboralForm.reset();

    this.listaExperiencia = [];

    this.serviciosExpediente.obtenerExperiencias(this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp
      ).subscribe((data: Experiencias[]) => {
      this.listaExperiencia = data;
      console.log('experienciaes');
      console.log(this.listaExperiencia);
    });

  }

  eliminarExperiencia (experienciaIcndex : expLaboralEmpleadoPK) : void {

    // obtengo los datos actuales antes de eliminar
  //      let tCapacitacion  =  this.experienciaForm.get('codCapacitacion');

  // con el indice voy a buscar el codContacto eliminado
  //      let tcodContacto =  tContacto.value[contactoIndex].codContacto;

  //      console.log('Elimino:'+ tcodContacto );

  // lo guardo para poder eliminarlo de bd despues
  //      this.ContactosEliminados.push(tcodContacto);

  //      console.log( this.ContactosEliminados );

      this.serviciosExpediente.eliminarExperiencia(
        experienciaIcndex
      ).subscribe(res=>{
           this.limpiar();
      });


    }



  regresoexpediente ()
  {
//    this.router.navigate(['/pages/experienciaes', codCia, codEmp]);
    this._router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp]);
  }

}

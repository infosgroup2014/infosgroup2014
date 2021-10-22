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
import { referenciaEmpPK, Referencias } from '../modelo/Referencias';
import { EquipoTrabajoComponent } from '../equipo-trabajo/equipo-trabajo.component';
import { equipoXEmpPK } from '../modelo/EquipoPK';
import { equipo } from '../modelo/tipoequipoPK';
import { CargarHXComponent } from '../../cargar-hx/cargar-hx.component';


@Component({
  selector: 'app-referencias',
  templateUrl: './referencias.component.html',
  styleUrls: ['./referencias.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class ReferenciasComponent implements OnInit {

  referenciaForm: FormGroup;
  listaParentescos=[];

  dependienteForm:FormGroup;

  EmpleadoSelec : equipoXEmpPK  = new equipoXEmpPK;

  listaReferencia = [];

  listaPuestos = [];

  listaTiposReferencias = [];

  listaTipo = [
    { label: 'Laboral', valor: 'L' },
    { label: 'Personal', valor: 'P' },
  ];

  listaEstado = [
    { label: 'Pendiente', valor: 'P' },
    { label: 'Entregado', valor: 'E' }
  ];





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


      this.serviciosExpediente.obtenerReferencias (CodCia, CodEmp, this.listaTipo[0].valor).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaReferencia = data;
       console.log(this.listaReferencia);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

       this.serviciosExpediente.obtenerReferencias (CodCia, CodEmp, this.listaTipo[1].valor).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaReferencia = this.listaReferencia.concat(data);
       console.log(this.listaReferencia);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });


    });




   }

  validationMessages: { [x: string]: any; } = {
    'nomReferencia': {
      'required': 'El campo es requerido'
    },
    'telefono': {
      'required': 'El campo es requerido',
    },
    'tipoReferencia': {
      'required': 'El campo es requerido',
    }

  };

  formErrors: { [x: string]: any; } = {
    'nomReferencia': '',
    'telefono': '',
    'tipoReferencia': ''
  };

  ngOnInit(): void {
    this.referenciaForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      nomReferencia : ['',[Validators.required]],
      puesto : [''],
      sueldo : ['0'],
      telefono: ['',[Validators.required]],
      tiempo: [''],
      tipoReferencia: ['',[Validators.required]],
      lugar : [''],
      email : ['']
    });

  }



  onSubmit(): void {
    console.log(this.referenciaForm);
  }


  logValidationError(group: FormGroup = this.referenciaForm): void {
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



  agregarReferencia ()
  {
    console.log('agregar equipo');

    console.log(this.referenciaForm);


    let treferencia : Referencias = new Referencias();
       treferencia.referenciaEmpPK = new referenciaEmpPK();
//       treferencia.equipo = new equipo();



       console.log('referencia');
       console.log(treferencia);

        treferencia.referenciaEmpPK.codCia = this.EmpleadoSelec.codCia;
        treferencia.referenciaEmpPK.codEmp = this.EmpleadoSelec.codEmp;


        treferencia.tipoReferencia = this.referenciaForm.get('tipoReferencia').value;
        treferencia.nomReferencia = this.referenciaForm.get('nomReferencia').value;
        treferencia.puesto = this.referenciaForm.get('puesto').value;
        treferencia.lugar = this.referenciaForm.get('lugar').value;
        treferencia.email = this.referenciaForm.get('email').value;
        treferencia.telefono = this.referenciaForm.get('telefono').value;
        treferencia.sueldo = this.referenciaForm.get('sueldo').value;

        treferencia.tiempo  = '';

       this.serviciosExpediente.guardarReferencia(treferencia).subscribe(
        datos => {
          if (datos.referenciaEmpPK.codReferencia) {


            Swal.fire('Guardar Referencia',
              'Datos Guardados con exito!',
              'success');

              this.limpiar();


          } else {
            Swal.fire('Guardar Referencia',
              'Error al Guardar',
              'error');
          }
        }
      );



  }

  limpiar() {
    this.referenciaForm.reset();

    this.listaReferencia = [];


    let CodCia = this.EmpleadoSelec.codCia  ;
    let CodEmp = this.EmpleadoSelec.codEmp  ;

    this.serviciosExpediente.obtenerReferencias (CodCia, CodEmp, this.listaTipo[0].valor).subscribe((data) => {
      console.log('regreso del servicio');
      console.log(data);
     this.listaReferencia = data;
     console.log(this.listaReferencia);
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });

     this.serviciosExpediente.obtenerReferencias (CodCia, CodEmp, this.listaTipo[1].valor).subscribe((data) => {
      console.log('regreso del servicio');
      console.log(data);
     this.listaReferencia = this.listaReferencia.concat(data);
     console.log(this.listaReferencia);
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });


  }

  eliminarExperiencia (referenciaIcndex : referenciaEmpPK) : void {

    // obtengo los datos actuales antes de eliminar
  //      let tCapacitacion  =  this.referenciaForm.get('codCapacitacion');

  // con el indice voy a buscar el codContacto eliminado
  //      let tcodContacto =  tContacto.value[contactoIndex].codContacto;

  //      console.log('Elimino:'+ tcodContacto );

  // lo guardo para poder eliminarlo de bd despues
  //      this.ContactosEliminados.push(tcodContacto);

  //      console.log( this.ContactosEliminados );

      this.serviciosExpediente.eliminarReferencia(
        referenciaIcndex
      ).subscribe(res=>{
           this.limpiar();
      });


    }



  regresoexpediente ()
  {
//    this.router.navigate(['/pages/equipoes', codCia, codEmp]);
    this._router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp]);
  }

}


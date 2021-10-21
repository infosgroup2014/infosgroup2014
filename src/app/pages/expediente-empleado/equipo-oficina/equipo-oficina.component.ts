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
import { Equipos } from '../modelo/Equipos';
import { EquipoTrabajoComponent } from '../equipo-trabajo/equipo-trabajo.component';
import { equipoXEmpPK } from '../modelo/EquipoPK';
import { equipo } from '../modelo/tipoequipoPK';



@Component({
  selector: 'app-equipo-oficina',
  templateUrl: './equipo-oficina.component.html',
  styleUrls: ['./equipo-oficina.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class EquipoOficinaComponent implements OnInit {

  equipoForm: FormGroup;
  listaParentescos=[];

  dependienteForm:FormGroup;

  EmpleadoSelec : equipoXEmpPK  = new equipoXEmpPK;

  listaEquipo = [];

  listaPuestos = [];

  listaTiposEquipos = [];

  listaNivel = [
    { label: 'Disponible', valor: '1' },
    { label: 'No Disponible', valor: '2' },
    { label: 'Pendiente', valor: '3' }
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


      this.serviciosExpediente.obtenerEquipos (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaEquipo = data;
       console.log(this.listaEquipo);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });




   }

  validationMessages: { [x: string]: any; } = {
    'codEquipo': {
      'required': 'El campo es requerido'
    },
    'fechaEntrega': {
      'required': 'El campo es requerido',
    }
  };

  formErrors: { [x: string]: any; } = {
    'codEquipo': '',
    'fechaEntrega': ''
  };

  ngOnInit(): void {
    this.equipoForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codEquipo : ['',[Validators.required]],
      fechaEntrega : ['',[Validators.required]],
      estadoEntrega : [''],
      comentarios : [''],
      nivel : ['']
    });

    this.serviciosExpediente.obtenerPuestos (this.EmpleadoSelec.codCia).subscribe((data) => {

      this.listaPuestos = data;
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });


     this.serviciosExpediente.obtenerTiposEquipos (this.EmpleadoSelec.codCia).subscribe((data) => {

      this.listaTiposEquipos = data;
      console.log('equipos');
      console.log(this.listaTiposEquipos);
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });
  }



  onSubmit(): void {
    console.log(this.equipoForm);
  }


  logValidationError(group: FormGroup = this.equipoForm): void {
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



  agregarEquipo ()
  {
    console.log('agregar equipo');

    console.log(this.equipoForm);


    let tequipo : Equipos = new Equipos();
       tequipo.equipoXEmpPK = new equipoXEmpPK();
//       tequipo.equipo = new equipo();

       const ttipoEquipo = {
         codCia : this.EmpleadoSelec.codCia,
         codEquipo : this.equipoForm.get('codEquipo').value
       };

//       new equipoPK();

       console.log('equipo');
       console.log(tequipo);

        tequipo.equipoXEmpPK.codCia = this.EmpleadoSelec.codCia;
        tequipo.equipoXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
        tequipo.equipoXEmpPK.codEquipo =   this.equipoForm.get('codEquipo').value;

//        ttipoEquipo.equipoPK.codCia = this.EmpleadoSelec?.codCia;
//      ttipoEquipo.equipoPK.codEquipo  = this.equipoForm.get('codEquipo').value;
//        tequipo.equipo.equipoPK.codCia = this.EmpleadoSelec.codCia;
//        tequipo.equipo.equipoPK.codEquipo  = this.equipoForm.get('codEquipo').value;
  //       tequipo.equipo.equipo.equipoPK = ttipoEquipo;

        tequipo.comentarios = this.equipoForm.get('comentarios').value;
        tequipo.estadoEntrega = this.equipoForm.get('estadoEntrega').value;
        tequipo.nivel = this.equipoForm.get('nivel').value;


        let fechaEntrega = this.equipoForm.get('fechaEntrega').value

        tequipo.fechaEntrega =
         String(
          fechaEntrega.day + '/' + fechaEntrega.month + '/' + fechaEntrega.year
        );

        tequipo.fechaBaja = '';

        tequipo.fechaRetorno = '';

       this.serviciosExpediente.guardarEquipo(tequipo).subscribe(
        datos => {
          if (datos.equipoXEmpPK.codEquipo) {


            Swal.fire('Guardar Equipo',
              'Datos Guardados con exito!',
              'success');

              this.limpiar();


          } else {
            Swal.fire('Guardar Equipo',
              'Error al Guardar',
              'error');
          }
        }
      );



  }

  limpiar() {
    this.equipoForm.reset();

    this.listaEquipo = [];

    this.serviciosExpediente.obtenerEquipos(this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp
      ).subscribe((data: Equipos[]) => {
      this.listaEquipo = data;
      console.log('equipos');
      console.log(this.listaEquipo);
    });

  }

  eliminarExperiencia (equipoIcndex : equipoXEmpPK) : void {

    // obtengo los datos actuales antes de eliminar
  //      let tCapacitacion  =  this.equipoForm.get('codCapacitacion');

  // con el indice voy a buscar el codContacto eliminado
  //      let tcodContacto =  tContacto.value[contactoIndex].codContacto;

  //      console.log('Elimino:'+ tcodContacto );

  // lo guardo para poder eliminarlo de bd despues
  //      this.ContactosEliminados.push(tcodContacto);

  //      console.log( this.ContactosEliminados );

      this.serviciosExpediente.eliminarEquipo(
        equipoIcndex
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


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
import { PruebasEmp, tipoPruebaXEmpPK } from '../modelo/Pruebas';



@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]

})
export class PruebasComponent implements OnInit {

  pruebasEmpForm: FormGroup;
  listaPruebas=[];
  EmpleadoSelec : tipoPruebaXEmpPK  = new tipoPruebaXEmpPK;

  listadoPruebas=[];

  validationMessages: { [x: string]: any; } = {
    'fecha': {
      'required': 'El campo es requerido'
    }

  };

  formErrors: { [x: string]: any; } = {
    'fecha': ''
    };


  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private _router : Router,
    private serviciosExpediente : AcademicaService
  ) {




    this.router.paramMap.subscribe( params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodEmp = +params.get('codEmp');
      console.log('Empleado:'+CodCia+'-'+CodEmp);
        this.EmpleadoSelec.codCia = CodCia;
        this.EmpleadoSelec.codEmp = CodEmp;
//        console.log('Empselect:'+this.EmpleadoSelec.codCia);


      this.serviciosExpediente.obtenerPruebasEmp (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaPruebas = data;
       console.log(this.listaPruebas);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });


    });

   }

  ngOnInit(): void {

    this.pruebasEmpForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codTipoPrueba : [''],
      fecha : ['',[Validators.required]],
      nota  : [''],
      resultado : ['']
    });



    this.serviciosExpediente.obtenerListadoPruebas (this.EmpleadoSelec.codCia).subscribe((data) => {

     this.listadoPruebas = data;
     console.log(this.listadoPruebas);
  //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
     });
  }

  agregarPruebaEmp ()
  {
    console.log('agregar equipo');

    console.log(this.pruebasEmpForm);


    let tPruebaEmp : PruebasEmp = new PruebasEmp();
       tPruebaEmp.tipoPruebaXEmpPK = new tipoPruebaXEmpPK();
//       tPruebaEmp.equipo = new equipo();



       console.log('referencia');
       console.log(tPruebaEmp);

        tPruebaEmp.tipoPruebaXEmpPK.codCia = this.EmpleadoSelec.codCia;
        tPruebaEmp.tipoPruebaXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
        tPruebaEmp.tipoPruebaXEmpPK.codTipoPrueba = this.pruebasEmpForm.get('codTipoPrueba').value;


        tPruebaEmp.nota = this.pruebasEmpForm.get('nota').value;
        tPruebaEmp.resultado = this.pruebasEmpForm.get('resultado').value;

        let fechainicio = this.pruebasEmpForm.get('fecha').value

        tPruebaEmp.fecha =
         String(
          fechainicio.day + '/' + fechainicio.month + '/' + fechainicio.year
        );



       this.serviciosExpediente.guardarPruebaEmp(tPruebaEmp).subscribe(
        datos => {
          if (datos.tipoPruebaXEmpPK.codTipoPrueba) {


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
    this.pruebasEmpForm.reset();

    this.listaPruebas = [];


    let CodCia = this.EmpleadoSelec.codCia  ;
    let CodEmp = this.EmpleadoSelec.codEmp  ;

    this.serviciosExpediente.obtenerPruebasEmp (CodCia, CodEmp).subscribe((data) => {
      console.log('regreso del servicio');
      console.log(data);
     this.listaPruebas = data;
     console.log(this.listaPruebas);

    });

  }


  eliminarPruebaEmp (pruebaIndex : tipoPruebaXEmpPK) : void {

      this.serviciosExpediente.eliminarPruebaEmp(
        pruebaIndex
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

  logValidationError(group: FormGroup = this.pruebasEmpForm): void {
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

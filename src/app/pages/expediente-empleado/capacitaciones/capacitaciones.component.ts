import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AcademicaService } from '../../servicio/prepAcademica.service'
import { Capacitaciones } from '../modelo/Capacitaciones';
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { capacitacionXEmpPK } from '../modelo/CapacitacionPK';
import Swal from "sweetalert2";

@Component({
  selector: 'app-capacitaciones',
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CapacitacionesComponent implements OnInit {

  capacitacionForm :FormGroup;

  validationMessages = {
    'descripcion': {
      'required': 'es requerido.'
    },
    'nomInstitucion': {
      'required': 'es requerido.'
    },
    'fechaCapacitacion': {
      'required': 'es requerido.'
    }
  };

  formErrors = {
    'descripcion': '',
    'nomInstitucion': '',
    'fechaCapacitacion': ''
  };



  listaCapacitaciones : Capacitaciones[] = [];

  EmpleadoSelec : capacitacionXEmpPK = new capacitacionXEmpPK;

  listaTipoCapac=[
    {tipo:'Taller',valor:'TA'}, {tipo:'Charla',valor:'CH'},
    {tipo:'Curso',valor:'CR'},  {tipo:'Seminario',valor:'SM'},
    {tipo:'Pasantia',valor:'PA'}, {tipo:'Diplomado',valor:'DP'}
  ];

  constructor(
    private router: ActivatedRoute,
    private _router : Router,
    private fb: FormBuilder,
    private serviciosExpediente : AcademicaService )
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


      this.serviciosExpediente.obtenerCapacitaciones(CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaCapacitaciones = data;
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });



   }

  ngOnInit(): void {

    this.capacitacionForm = this.fb.group({
      descripcion: ['',[Validators.required]],
      fecha: [''],
      fechaCapacitacion: ['',[Validators.required]],
      codInsti: [''],
      tipo: [''],
      nacional: [''],
      horasRecibidas: [''],
      nomInstitucion: ['',[Validators.required]],
      documentoValida: [''],
      status: [''],
      nota: ['']
    });

  }

  logValidationErrors(group: FormGroup = this.capacitacionForm): void {

    Object.keys(group.controls).forEach((key: string) => {

      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        console.log('Validaciones...')
        console.log(messages);
        console.log(abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }

      }

    });

  }


agregarCapacitacion ()
{
  console.log('agregar capacitacion');

  console.log(this.capacitacionForm);


  let capacitacion : Capacitaciones = new Capacitaciones();
      capacitacion.capacitacionXEmpPK = new capacitacionXEmpPK();


      capacitacion.capacitacionXEmpPK.codCia = this.EmpleadoSelec.codCia;
      capacitacion.capacitacionXEmpPK.codEmp = this.EmpleadoSelec.codEmp;

      capacitacion.descripcion = this.capacitacionForm.get('descripcion').value;
      capacitacion.nomInstitucion = this.capacitacionForm.get('nomInstitucion').value;
      capacitacion.tipo = this.capacitacionForm.get('tipo').value;

      let fechacapacitacion = this.capacitacionForm.get('fechaCapacitacion').value

      capacitacion.fechaCapacitacion =
       String(
        fechacapacitacion.day + '/' + fechacapacitacion.month + '/' + fechacapacitacion.year
      );


     this.serviciosExpediente.guardarCapacitacion(capacitacion).subscribe(
      datos => {
        if (datos.capacitacionXEmpPK.codCapacitacion) {


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
  this.capacitacionForm.reset();

  this.listaCapacitaciones = [];

  this.serviciosExpediente.obtenerCapacitaciones(this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp
    ).subscribe((data: Capacitaciones[]) => {
    this.listaCapacitaciones = data;
    console.log('capacitaciones');
    console.log(this.listaCapacitaciones);
  });

}

eliminarContacto (capacitacionIcndex : capacitacionXEmpPK) : void {

  // obtengo los datos actuales antes de eliminar
//      let tCapacitacion  =  this.capacitacionForm.get('codCapacitacion');

// con el indice voy a buscar el codContacto eliminado
//      let tcodContacto =  tContacto.value[contactoIndex].codContacto;

//      console.log('Elimino:'+ tcodContacto );

// lo guardo para poder eliminarlo de bd despues
//      this.ContactosEliminados.push(tcodContacto);

//      console.log( this.ContactosEliminados );

    this.serviciosExpediente.eliminarCapacitacion(
      capacitacionIcndex
    ).subscribe(res=>{
         this.limpiar();
    });


  }

  regresoexpediente ()
  {
//    this.router.navigate(['/pages/capacitaciones', codCia, codEmp]);
    this._router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp]);
  }

}

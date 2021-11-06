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
import { IdiomasEmp, idiomaXEmpPK } from '../modelo/IdiomasEmp';




@Component({
  selector: 'app-idiomas',
  templateUrl: './idiomas.component.html',
  styleUrls: ['./idiomas.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]

})
export class IdiomasComponent implements OnInit {


  idiomaEmpForm:FormGroup;

  EmpleadoSelec : dependienteXEmpPK = new dependienteXEmpPK;


    listaIdiomasEmp=[];
    listadoIdiomas = [];

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


      this.serviciosExpediente.obtenerIdiomasEmp (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaIdiomasEmp = data;
       console.log(this.listaIdiomasEmp);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });


   }

  ngOnInit(): void {

    this.idiomaEmpForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codIdioma:[''],
      lee :[''],
      escribe :[''],
      nivel :['']
    });

    this.serviciosExpediente.obtenerListadoIdiomas(this.EmpleadoSelec.codCia).subscribe(

    (data) => {this.listadoIdiomas = data;
    });
  }


  regresoexpediente ()
  {
//    this.router.navigate(['/pages/equipoes', codCia, codEmp]);
    this._router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp]);
  }


  agregarIdiomaEmp ()
  {

    console.log('forma idioma');
  console.log(this.idiomaEmpForm);

  let tIdiomaEmp : IdiomasEmp = new IdiomasEmp();
  tIdiomaEmp.idiomaXEmpPK = new idiomaXEmpPK();

   tIdiomaEmp.idiomaXEmpPK.codCia = this.EmpleadoSelec.codCia;
   tIdiomaEmp.idiomaXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
   tIdiomaEmp.idiomaXEmpPK.codIdioma = this.idiomaEmpForm.get('codIdioma').value;

   tIdiomaEmp.lee = this.idiomaEmpForm.get('lee').value;
   tIdiomaEmp.escribe = this.idiomaEmpForm.get('escribe').value;
   tIdiomaEmp.nivel = this.idiomaEmpForm.get('nivel').value;


  this.serviciosExpediente.guardarIdiomaEmp(tIdiomaEmp).subscribe(
   datos => {
     if (datos.idiomaXEmpPK.codIdioma) {


       Swal.fire('Guardar Idioma Empleado',
         'Datos Guardados con exito!',
         'success');

         this.limpiar();


     } else {
       Swal.fire('Guardar Idioma Empleado',
         'Error al Guardar',
         'error');
     }
   }
 );


  }

  limpiar() {

//    this.experienciaLaboralForm.reset();

    this.listaIdiomasEmp = [];

    this.serviciosExpediente.obtenerIdiomasEmp(this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp
      ).subscribe((data: any[]) => {
      this.listaIdiomasEmp = data;
      console.log('experienciaes');
      console.log(this.listaIdiomasEmp);
    });

  }



  eliminarIdiomaEmp (IdiomaPK : idiomaXEmpPK) : void {


      this.serviciosExpediente.eliminarIdiomaEmp(
        IdiomaPK
      ).subscribe(res=>{
           this.limpiar();
      });


    }




}

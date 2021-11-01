import { PlanillaService } from './../../servicio/planilla.service';
import { AcademicaService } from './../../servicio/prepAcademica.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { max } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import Swal from "sweetalert2";
import { nivelesXEmpPK } from '../modelo/NivelAcademicoPK';
import { nivelAcademico } from '../modelo/NivelAcademico';


@Component({
  selector: 'app-preparacion-academica',
  templateUrl: './preparacion-academica.component.html',
  styleUrls: ['./preparacion-academica.component.css']
})
export class PreparacionAcademicaComponent implements OnInit {
  listaAcademico=[{nombreInstituto:'instituto',titulo:'doctor',anioEgre:2020,anioIngre:2018,colegiado:1},
  {nombreInstituto:'academia',titulo:'musico',anioEgre:2020,anioIngre:2018,colegiado:1}
  ];
listadoPaises:Array<any>;
listaDeptoPrepAcamedica:Array<any>;
codPais:number;
listarNiveles: Array<any>;
listarProfesiones: Array<any>;
listadoPrepAcademica: Array<any>;

nivelAcademicoForm: FormGroup;

EmpleadoSelec : nivelesXEmpPK  = new nivelesXEmpPK;

  constructor(private router: Router,
     private fb: FormBuilder,
     private _router: ActivatedRoute,
     private serviciosExpediente : AcademicaService,
     private serviciosPlanilla : PlanillaService

     ) {
    this.serviciosPlanilla.obtenerPaises().subscribe(
        paises=>{
            this.listadoPaises=paises;
        }
        );
    this.obtenerCia(3,5);

    this._router.paramMap.subscribe( params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodEmp = +params.get('codEmp');
      console.log('Empleado:'+CodCia+'-'+CodEmp);
        this.EmpleadoSelec.codCia = CodCia;
        this.EmpleadoSelec.codEmp = CodEmp;
//        console.log('Empselect:'+this.EmpleadoSelec.codCia);


      this.serviciosExpediente.obtenerPrepAcademica (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listadoPrepAcademica = data;
       console.log(this.listadoPrepAcademica);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });


  }


  ngOnInit(): void {


    this.nivelAcademicoForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codNivel : [''],
      correlativo : [''],
      nomInstitucion:[''],
      codPais:[''],
      codDepto:[''],
      codProfesion:[''],
      anioIngreso:[''],
      anioEgreso:[''],
      noColegiado:['']
    });


  }

  obtenerCia(cia: number, emp: number) {
    this.serviciosExpediente.obtenerNivelAcademico(cia).subscribe(
        niveles => {
            this.listarNiveles = niveles;
        }
    );

    this.serviciosExpediente.obtenerProfesionAcadem(cia).subscribe(
        profesion => {
            this.listarProfesiones = profesion;
        }
    );

  }

  obtenerDeptoPrepAcademica(data:any){
    this.codPais=data.codPais;
    this.serviciosPlanilla.obtenerDeptoPais(data.codPais).subscribe(
      depto=>
         this.listaDeptoPrepAcamedica=depto
      );

      console.log(this.listaDeptoPrepAcamedica);

  }


  agregarNivelAcademico () {

  console.log('forma nivel academico');
  console.log(this.nivelAcademicoForm);

  let tnivelAcademico : nivelAcademico = new nivelAcademico();
  tnivelAcademico.nivelesXEmpPK = new nivelesXEmpPK();
  //tnivelAcademico.profesion
//       tnivelAcademico.equipo = new equipo();

  console.log('nivel academico');
  console.log(tnivelAcademico);




   tnivelAcademico.nivelesXEmpPK.codCia = this.EmpleadoSelec.codCia;
   tnivelAcademico.nivelesXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
   tnivelAcademico.nivelesXEmpPK.codNivel = this.nivelAcademicoForm.get('codNivel').value;

   tnivelAcademico.nomInstitucion = this.nivelAcademicoForm.get('nomInstitucion').value;
   tnivelAcademico.codPais = this.nivelAcademicoForm.get('codPais').value;
   tnivelAcademico.codDepto = this.nivelAcademicoForm.get('codDepto').value;
   tnivelAcademico.anioIngreso = this.nivelAcademicoForm.get('anioIngreso').value;
   tnivelAcademico.anioEgreso = this.nivelAcademicoForm.get('anioEgreso').value;
   tnivelAcademico.estadoNivel = 'A';
   tnivelAcademico.fecEstado = null;
   tnivelAcademico.subNivel = this.nivelAcademicoForm.get('codProfesion').value;
   tnivelAcademico.noColegiado = this.nivelAcademicoForm.get('noColegiado').value;


  this.serviciosExpediente.guardarPreparacionAcademica(tnivelAcademico).subscribe(
   datos => {
     if (datos.nivelesXEmpPK.correlativo) {


       Swal.fire('Guardar Preparación Académica',
         'Datos Guardados con exito!',
         'success');

         this.limpiar();


     } else {
       Swal.fire('Guardar Preparación Académica',
         'Error al Guardar',
         'error');
     }
   }
 );



}

limpiar() {
this.nivelAcademicoForm.reset();

this.listadoPrepAcademica = [];


let CodCia = this.EmpleadoSelec.codCia  ;
let CodEmp = this.EmpleadoSelec.codEmp  ;

this.serviciosExpediente.obtenerPrepAcademica (CodCia, CodEmp).subscribe((data) => {
  console.log('regreso del servicio');
  console.log(data);
 this.listadoPrepAcademica = data;
 console.log(this.listadoPrepAcademica);
//console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
 });

}

eliminarNivelAcademico (nivelesXEmpPK : nivelesXEmpPK) : void {


 this.serviciosExpediente.eliminarPreparacionAcademica(
  nivelesXEmpPK
 ).subscribe(res=>{
      this.limpiar();
 });


}



regresoexpediente ()
{
//    this.router.navigate(['/pages/equipoes', codCia, codEmp]);
this.router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
this.EmpleadoSelec.codEmp]);
}

}






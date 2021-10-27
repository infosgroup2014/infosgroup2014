import { Component, OnInit } from '@angular/core';
import { ReclutamientoService } from './../../servicio/reclutamiento.service';
import { PlanillaService } from './../../servicio/planilla.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { NivelesXCandidato } from './modelo/nivelesXCandidato';
import { NivelesXCandidatoPK } from './modelo/NivelesXCandidatoPK';
import Swal from "sweetalert2";

@Component({
  selector: 'ngx-preparacion-academica',
  templateUrl: './preparacion-academica.component.html',
  styleUrls: ['./preparacion-academica.component.scss']
})
export class PreparacionAcademicaCanComponent implements OnInit {

  preparacionAcademicaCForm: FormGroup;

  validationMessages = {
    'codNivel': {
      'required': 'el campo es requerido.'
    },
    'subNivel': {
      'required': 'el campo requerido.'
    },
    'nomInstitucion': {
      'required': 'el campo es requerido',
      'maxLength': 'El tamaño maximo para el campo es 100 caracteres '
    },
    'anioIngreso': {
      'maxLength': 'El tamaño maximo para el campo es 4 digitos '
    },
    'anioEgreso': {
      'maxLength': 'El tamaño maximo para el campo es 4 digitos '
    },
    'codPais': {
      'required': 'el campo es requerido.'
    },
    'codDepto': {
      'required': 'el campo es requerido.'
    }

  };

  formErrors = {
    'codNivel': '',
    'subNivel': '',
    'nomInstitucion': '',
    'anioIngreso': '',
    'anioEgreso': '',
    'codPais': '',
    'codDepto': ''
  };

  listaAcademico: NivelesXCandidato[] = [];

  CandidatoSelec: NivelesXCandidatoPK = new NivelesXCandidatoPK;

  /* listaAcademico = [{ nombreInstituto: 'instituto', titulo: 'doctor', anioEgre: 2020, anioIngre: 2018, colegiado: 1 },
   { nombreInstituto: 'academia', titulo: 'musico', anioEgre: 2020, anioIngre: 2018, colegiado: 1 }
   ];*/

  listadoPaises: Array<any>;
  listaDeptoPrepAcamedica: Array<any>;
  codPais: number;
  listarNiveles: Array<any>;
  listarProfesiones: Array<any>;
  listadoPrepAcademica: Array<any>;



  constructor(
    private _router: Router,
    private router: ActivatedRoute,
    private servicioPlanilla: PlanillaService,
    private prepAcademicaService: ReclutamientoService,
    private fb: FormBuilder,
    private _route: Router) {



    this.router.paramMap.subscribe(params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodCandidato = +params.get('codCandidato');
      console.log('Candidato:' + CodCia + '-' + CodCandidato);
      this.CandidatoSelec.codCia = CodCia;
      this.CandidatoSelec.codCandidato = CodCandidato;
      //        console.log('Empselect:'+this.EmpleadoSelec.codCia);


      // this.serviciosExpediente.obtenerCapacitaciones(CodCia, CodEmp).subscribe((data) => {
      //   console.log('regreso del servicio');
      //   console.log(data);
      //  this.listaCapacitaciones = data;
      //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
      //   });

    });







    this.servicioPlanilla.obtenerPaises().subscribe(
      paises => {
        this.listadoPaises = paises;
      }
    );
    this.obtenerCia(this.CandidatoSelec.codCia, this.CandidatoSelec.codCandidato);

  }

  ngOnInit(): void {
    this.servicioPlanilla.logueado = true;

    this.preparacionAcademicaCForm = this.fb.group({
      codCia: [''],
      codCandidato: [''],
      codNivel: ['', Validators.required],
      estadoNivel: [''],
      fecEstado: [''],
      subNivel: ['', Validators.required],
      nomInstitucion: ['', [Validators.required, Validators.maxLength(100)]],
      anioIngreso: ['', Validators.maxLength(4)],
      anioEgreso: ['', Validators.maxLength(4)],
      codPais: ['', Validators.required],
      codDepto: ['', Validators.required],
      noColegiado: [''],
      correlativo: ['']
    });
  }


  logValidationErrors(group: FormGroup = this.preparacionAcademicaCForm): void {

    Object.keys(group.controls).forEach((key: string) => {

      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        console.log('Validaciones...')
        console.log(messages);
        console.log(abstractControl.errors);
        console.log(this.preparacionAcademicaCForm)
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



  obtenerCia(cia: number, emp: number) {
    this.prepAcademicaService.obtenerNivelAcademico(cia).subscribe(
      niveles => {
        this.listarNiveles = niveles;
        console.log("datos que ingresan de profesiones " +  this.listarNiveles)
      }
    );

    this.prepAcademicaService.obtenerProfesionAcadem(cia).subscribe(
      profesion => {
        this.listarProfesiones = profesion;
       
      }
    );

    this.prepAcademicaService.obtenerNivelAcademicoC(cia, emp).subscribe((data) => {
      // console.log(JSON.stringify(dat));
      this.listadoPrepAcademica = data;
      
    });
  }


  obtenerDeptoPrepAcademica(data: any) {
    this.codPais = data.codPais;
    this.servicioPlanilla.obtenerDeptoPais(data.codPais).subscribe(depto => this.listaDeptoPrepAcamedica = depto);

  }

  agregarPreparacion() {
    console.log('agregar preparacion');

    console.log(this.preparacionAcademicaCForm);


    let preparacion: NivelesXCandidato = new NivelesXCandidato();
    preparacion.nivelesXCandidatoPK = new NivelesXCandidatoPK();


    preparacion.nivelesXCandidatoPK.codCia = this.CandidatoSelec.codCia;
    preparacion.nivelesXCandidatoPK.codCandidato = this.CandidatoSelec.codCandidato;
    preparacion.nivelesXCandidatoPK.codNivel = this.preparacionAcademicaCForm.get('codNivel').value;


    preparacion.nomInstitucion = this.preparacionAcademicaCForm.get('nomInstitucion').value;
    preparacion.codPais = this.preparacionAcademicaCForm.get('codPais').value;
    preparacion.codDepto = this.preparacionAcademicaCForm.get('codDepto').value;
    preparacion.subNivel = this.preparacionAcademicaCForm.get('subNivel').value;
    preparacion.anioIngreso = this.preparacionAcademicaCForm.get('anioIngreso').value;
    preparacion.anioEgreso = this.preparacionAcademicaCForm.get('anioEgreso').value;
    




    this.prepAcademicaService.guardarPreparacion(preparacion).subscribe(
      datos => {
        if (datos.nivelesXCandidatoPK.correlativo) {


          Swal.fire('Guardar Preparacion Academica',
            'Datos Guardados con exito!',
            'success');

          this.limpiar();


        } else {
          Swal.fire('Guardar Preparacion Academica',
            'Error al Guardar',
            'error');
        }
      }
    );



  }


  limpiar() {
    this.preparacionAcademicaCForm.reset();
  
    this.listaAcademico = [];
  
    this.prepAcademicaService.obtenerNivelAcademicoC(this.CandidatoSelec.codCia, this.CandidatoSelec.codCandidato).subscribe((data) => {
      // console.log(JSON.stringify(dat));
      this.listadoPrepAcademica = data;
      
    });
  
  }

  eliminarPreparacion (PreparacionIcndex : NivelesXCandidatoPK) : void {

    // obtengo los datos actuales antes de eliminar
  //      let tCapacitacion  =  this.capacitacionForm.get('codCapacitacion');
  
  // con el indice voy a buscar el codContacto eliminado
  //      let tcodContacto =  tContacto.value[contactoIndex].codContacto;
  
  //      console.log('Elimino:'+ tcodContacto );
  
  // lo guardo para poder eliminarlo de bd despues
  //      this.ContactosEliminados.push(tcodContacto);
  
  //      console.log( this.ContactosEliminados );
  
      this.prepAcademicaService.eliminarPreparacion(
        PreparacionIcndex
      ).subscribe(res=>{
        Swal.fire('Eliminar Preparacion Academica',
        'Se elimino el registro con exito!',
        'success');
           this.limpiar();
      });
  
  
    }


    regresoCandidato ()
    {
  //    this.router.navigate(['/pages/capacitaciones', codCia, codEmp]);
      this._router.navigate(['/pages/preparacion-academica-candidato-editado', this.CandidatoSelec.codCia,
      this.CandidatoSelec.codCandidato]);
    }

}

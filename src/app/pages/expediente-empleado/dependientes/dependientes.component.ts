import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicaService } from '../../servicio/prepAcademica.service';
import { dependienteXEmpPK } from '../modelo/DependientesPK';
import { Dependientes } from '../modelo/Dependietnes';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dependientes',
  templateUrl: './dependientes.component.html',
  styleUrls: ['./dependientes.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]

})
export class DependientesComponent implements OnInit {
  dependienteForm!: FormGroup;
  nacimiento: NgbDateStruct;

  listaDependientes = [];

  EmpleadoSelec : dependienteXEmpPK = new dependienteXEmpPK;

  listaParentescos = [
    { nombreParentesco: '--Seleccione--', codigoParentesco: '' },
    { nombreParentesco: 'hijo(a)', codigoParentesco: '1' },
    { nombreParentesco: 'padre', codigoParentesco: '2' },
    { nombreParentesco: 'madre', codigoParentesco: '3' },
    { nombreParentesco: 'esposo', codigoParentesco: '4' },
    { nombreParentesco: 'esposa', codigoParentesco: '5' }
  ];


  listaSexo = [
    { sexoParentesco: '--Seleccione--', codigoSexo: '' },
    { sexoParentesco: 'Femenino', codigoSexo: 'F' },
    { sexoParentesco: 'Masculino', codigoSexo: 'M' }
  ];

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


      this.serviciosExpediente.obtenerDependientes (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaDependientes = data;
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });



  }

  validationMessages: { [x: string]: any; } = {
    'nombre': {
      'required': 'El nombre es requerido',
      'maxlength': 'Solo se permiten 50 caracteres para el campo nombre'
    },
    'codParentesco': {
      'required': 'El campo parentesco es requerido',
    },
  };

  formErrors: { [x: string]: any; } = {
    'nombre': '',
    'codParentesco': ''
  };

  ngOnInit(): void {
    this.dependienteForm = this.fb.group({
      codCia: [''],
      codEmp: [''],
      codDependiente: [''],
      codParentesco: ['', Validators.required],
      fechaNacimiento: [''],
      nombre: ['', Validators.required],
      sexo: [''],
      identidad: [''],
      dependiente: ['']
    })
  }


  get codCia() { return this.dependienteForm.get('codCia'); }
  get codEmp() { return this.dependienteForm.get('codEmp'); }
  get codDependiente() { return this.dependienteForm.get('codDependiente'); }
  get codParentesco() { return this.dependienteForm.get('codParentesco'); }
  get fechaNacimiento() { return this.dependienteForm.get('fechaNacimiento'); }
  get nombre() { return this.dependienteForm.get('nombre'); }
  get sexo() { return this.dependienteForm.get('sexo'); }
  get identidad() { return this.dependienteForm.get('identidad'); }
  get dependiente() { return this.dependienteForm.get('dependiente'); }

  onSubmit(): void {
    console.log(this.dependienteForm);
  }

  logValidationError(group: FormGroup = this.dependienteForm): void {
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

  agregarDependiente ()
  {
    console.log('agregar dependiente');

    console.log(this.dependienteForm);


    let dependiente : Dependientes = new Dependientes();
      dependiente.dependienteXEmpPK = new dependienteXEmpPK();


        dependiente.dependienteXEmpPK.codCia = this.EmpleadoSelec.codCia;
        dependiente.dependienteXEmpPK.codEmp = this.EmpleadoSelec.codEmp;

        dependiente.nombre = this.dependienteForm.get('nombre').value;
        dependiente.codParentesco = this.dependienteForm.get('codParentesco').value;
        dependiente.sexo = this.dependienteForm.get('sexo').value;

        let fechaNac = this.dependienteForm.get('fechaNacimiento').value;

        dependiente.fechaNacimiento =
         String(
          fechaNac.day + '/' + fechaNac.month + '/' + fechaNac.year
        );


       this.serviciosExpediente.guardarDependiente(dependiente).subscribe(
        datos => {
          if (datos.dependienteXEmpPK.codDependiente) {


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
    this.dependienteForm.reset();

    this.listaDependientes = [];

    this.serviciosExpediente.obtenerDependientes(this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp
      ).subscribe((data: Dependientes[]) => {
      this.listaDependientes = data;
      console.log('dependientes');
      console.log(this.listaDependientes);
    });

  }

  eliminarContacto (dependienteIcndex : dependienteXEmpPK) : void {

    // obtengo los datos actuales antes de eliminar
  //      let tCapacitacion  =  this.capacitacionForm.get('codCapacitacion');

  // con el indice voy a buscar el codContacto eliminado
  //      let tcodContacto =  tContacto.value[contactoIndex].codContacto;

  //      console.log('Elimino:'+ tcodContacto );

  // lo guardo para poder eliminarlo de bd despues
  //      this.ContactosEliminados.push(tcodContacto);

  //      console.log( this.ContactosEliminados );

      this.serviciosExpediente.eliminarDependiente(
        dependienteIcndex
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

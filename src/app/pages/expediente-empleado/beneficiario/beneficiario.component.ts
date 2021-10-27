import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, EmailValidator, FormArray } from '@angular/forms';
import { max } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { AcademicaService } from '../../servicio/prepAcademica.service';

import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import Swal from "sweetalert2";

import { Beneficiarios, beneficiarioXEmpPK } from '../modelo/Beneficiarios';



@Component({
  selector: 'app-beneficiario',
  templateUrl: './beneficiario.component.html',
  styleUrls: ['./beneficiario.component.css']
})

export class BeneficiarioComponent implements OnInit {

  beneficiarioForm : FormGroup;

  EmpleadoSelec : beneficiarioXEmpPK  = new beneficiarioXEmpPK;

  validationMessages: { [x: string]: any; } = {
    'nombre': {
      'required': 'El nombre es requerido',
      'maxlength': 'Solo se permiten 50 caracteres para el campo nombre'
    },
    'codParentesco': {
      'required': 'El campo parentesco es requerido',
    },
     'porcentaje':{
       'required':'El campo de porcentaje es requerido',
       'max':'El maximo valor a asignar es 100%',
       'min':'El minimo valor a asignar es 1%'
     }
  };

  formErrors: { [x: string]: any; } = {
    'nombre': '',
    'codParentesco': ''
  };

  listaBeneficiario = [];

  listaParentescos = [
    { label : 'hijo(a)', valor : '1' },
    { label: 'padre', valor: '2' },
    { label: 'madre', valor: '3' },
    { label: 'esposo', valor: '4' },
    { label: 'esposa', valor: '5' }
  ];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router : Router,
              private serviciosExpediente  : AcademicaService
              )
               {



    this.route.paramMap.subscribe( params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodEmp = +params.get('codEmp');
      console.log('Empleado:'+CodCia+'-'+CodEmp);
        this.EmpleadoSelec.codCia = CodCia;
        this.EmpleadoSelec.codEmp = CodEmp;
//        console.log('Empselect:'+this.EmpleadoSelec.codCia);


      this.serviciosExpediente.obtenerBeneficiarios (CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaBeneficiario = data;
       console.log(this.listaBeneficiario);
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

   });
  }


ngOnInit(): void {


  console.log('parentesco');
  console.log(this.listaParentescos);

  this.beneficiarioForm = this.fb.group({
    codCia: [''],
    codEmp: [''],
    codBeneficiario: [''],
    codParentesco: ['', Validators.required],
    porcentaje: ['',[Validators.required,Validators.min(1),Validators.max(100)]],
    nombre: ['', Validators.required],
    codEmpAnterior: [''],
    identidad: [''],
    numIgss: ['']
  });

  this.listaParentescos = [];
  this.serviciosExpediente.obtenerParentesco (this.EmpleadoSelec.codCia).subscribe((data) => {
    console.log('regreso los parentescos');
    console.log(data);
   this.listaParentescos = data;

   });


}

  onSubmit(): void {
    console.log(this.beneficiarioForm);
  }

  logValidationError(group: FormGroup = this.beneficiarioForm): void {
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




  guardarBeneficiario ()
  {
    console.log('agregar beneficio');

    console.log(this.beneficiarioForm);


    let tbeneficiario : Beneficiarios = new Beneficiarios();
       tbeneficiario.beneficiarioXEmpPK = new beneficiarioXEmpPK();
//       tbeneficiario.equipo = new equipo();

       const ttipoEquipo = {
         codCia : this.EmpleadoSelec.codCia,
         codEquipo : this.beneficiarioForm.get('codBeneficiario').value
       };

//       new equipoPK();

       console.log('beneficiario');
       console.log(tbeneficiario);

        tbeneficiario.beneficiarioXEmpPK.codCia = this.EmpleadoSelec.codCia;
        tbeneficiario.beneficiarioXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
        tbeneficiario.beneficiarioXEmpPK.codBeneficiario =   this.beneficiarioForm.get('codBeneficiario').value;


        tbeneficiario.nombre = this.beneficiarioForm.get('nombre').value;
        tbeneficiario.codParentesco = this.beneficiarioForm.get('codParentesco').value;
        tbeneficiario.porcentaje = this.beneficiarioForm.get('porcentaje').value;

       this.serviciosExpediente.guardarBeneficiario(tbeneficiario).subscribe(
        datos => {
          if (datos.beneficiarioXEmpPK.codBeneficiario) {


            Swal.fire('Guardar Beneficiario',
              'Datos Guardados con exito!',
              'success');

              this.limpiar();


          } else {
            Swal.fire('Guardar Beneficiario',
              'Error al Guardar',
              'error');
          }
        }
      );



  }

  limpiar() {
    this.beneficiarioForm.reset();

    this.listaBeneficiario = [];

    this.serviciosExpediente.obtenerBeneficiarios(this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp
      ).subscribe((data: Beneficiarios[]) => {
      this.listaBeneficiario = data;
      console.log('beneficiarios');
      console.log(this.listaBeneficiario);
    });

  }

  eliminarExperiencia (beneficiarioIndex : beneficiarioXEmpPK) : void {


      this.serviciosExpediente.eliminarBeneficiario(
        beneficiarioIndex
      ).subscribe(res=>{
           this.limpiar();
      });


    }

  regresoexpediente ()
  {
//    this.router.navigate(['/pages/capacitaciones', codCia, codEmp]);
    this.router.navigate(['/pages/expediente_editado', this.EmpleadoSelec.codCia,
    this.EmpleadoSelec.codEmp]);
  }

}

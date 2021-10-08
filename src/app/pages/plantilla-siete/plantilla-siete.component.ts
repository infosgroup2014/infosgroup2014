import { Component, OnInit } from '@angular/core';
import { PlanillaService } from '../servicio/planilla.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Empleado } from '../modelo/Empleado';
import { NgbDateStruct, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { EncabezadoEmp } from '../accion-personal/modelo/EncabezadoEmp';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { NgbDateFRParserFormatter } from '../formatos/ngb-date-fr-parser-formatter';

@Component({
  selector: 'ngx-plantilla-siete',
  templateUrl: './plantilla-siete.component.html',
  styleUrls: ['./plantilla-siete.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
  ]
})
export class PlantillaSieteComponent implements OnInit {

  p: number = 1;
  formEmpleado: FormGroup;
  plantillaSieteForm: FormGroup;
  empleado: Empleado = new Empleado();
  fechaSolicitud: NgbDateStruct;
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();
  listaDepartamentos: Array<any> = [];
  listaGerencias: Array<any>;
  listadoEmpleado: Array<any>;
  listaPuesto: Array<any> = [];
  listaPosiciones: Array<any>;
  plazaSeleccionado: any;
  fechaInicial: NgbDateStruct;
  fechaFinal:NgbDateStruct;

  constructor(private calendar: NgbCalendar,public planillaService:PlanillaService,private router: Router,private fb: FormBuilder) {
    planillaService.logueado=true;
    this.fechaSolicitud = this.calendar.getToday();
   }

  ngOnInit(): void {
    this.llenarListas();
    this.creaFormAccionNoAfecta();
    this.createForm();
    this.llenadoEmpleadoInicial();
  }


  createForm() {
    this.formEmpleado = this.fb.group({
      codEmp: [''],
      nombre: [''],
      numDui: ['']
    });
  }

  llenarListas(): void {
     this.planillaService.obtenerPosiciones(3, 'V').subscribe(posicion => this.listaPosiciones = posicion);
     this.planillaService.obtenerDireccion(3).subscribe(gerencia => this.listaGerencias = gerencia);
     this.planillaService.obtenerPuestos(3).subscribe(puesto => this.listaPuesto = puesto);
    //this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(tipoPlanilla => this.listarTiposPlanilla = tipoPlanilla);
    //this.planillaService.obtenerEmpresas(3).subscribe(empresa => this.listadoEmpresas = empresa);

  }


  limpiar() {
    this.formEmpleado.reset();
    const objeto = {
      empresa: 3,
      estado: true
    };

    this.listadoEmpleado = [];

    this.planillaService.obtenerEmpleados(objeto).subscribe((data) => {
      this.listadoEmpleado = data;
    });
  }


  obtenerPosicion(objeto: any): void {
    this.plazaSeleccionado = objeto;
    //  console.log('Plazas::' + JSON.stringify(this.plazaSeleccionado));
  }


  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;
  }

  llenarGerencias(valor: any) {
    this.listaDepartamentos = [];
    this.plantillaSieteForm.get('gerencia').setValue(valor?.codGerencia);
    this.planillaService.obtenerDeptoByGerencia(3, valor?.codGerencia).subscribe(depart => this.listaDepartamentos = depart);
    this.plantillaSieteForm.get('departamento').setValue(valor?.departamento?.departamentosPK?.codDepto);
    this.plantillaSieteForm.get('puesto').setValue(valor?.puesto?.puestosPK.codPuesto);
  }


  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
    this.llenarGerencias(this.depenciaEmpleado);
  }


  obtenerEmpleado(cia: number, codigo: number) {
    this.planillaService.obtenerEmpleado(cia, codigo).subscribe((data) => {
      /* console.log('################################');
       console.log('------>EL EMPLEADO ASIG' + JSON.stringify(data));
       console.log('-------------------------------------------');*/
      this.asignarEmpleado(data);
    });


    this.planillaService.obtenerDepenciaEmpleado(cia, codigo).subscribe((valores) => {
      console.log(JSON.stringify(valores));
      this.asignarDependenciaEmpleado(valores);
    });
  }




  llenadoEmpleadoInicial() {
    const objeto = {
      empresa: 3,
      estado: true,
    };

    this.planillaService.obtenerEmpleados(objeto).subscribe((data) => {
      this.listadoEmpleado = data;
    });


    const objetoInactivo = {
      empresa: 3
    }


  }



  creaFormAccionNoAfecta() {
    this.plantillaSieteForm = this.fb.group({
      tipoAccion: ['', [Validators.required]],
      motivo: [''],
      dias: [''],
      detalle: [''],
      observacion: [''],
      incapacidad: [''],
      institucion: [''],
      gerencia: [''],
      departamento: [''],
      puesto: [''],
      cambioPlanilla: [''],
      empresa: [''],
      nuevoSalario:[''],
      nuevaBonificacion:[]

    });
  }



  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
  }


  llenarDepartamentos(event) {
    let valor: number = event.target.value;
    this.planillaService.obtenerDeptoByGerencia(3, valor).subscribe(depart => this.listaDepartamentos = depart);
  }



  guardarAccionTemplate7():void{

  }



  Buscar() {
    this.p = 1;
    let formEmpleado = new FormEmpleadoModel();

    formEmpleado.empresa = 3;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion != 30) {
      formEmpleado.estado = true;
    }


    if (this.formEmpleado.get('codEmp').value) {
      formEmpleado.codEmp = Number(this.formEmpleado.get('codEmp').value);
    }

    if (this.formEmpleado.get('nombre').value) {
      formEmpleado.nombre = String(this.formEmpleado.get('nombre').value);
    }

    if (this.formEmpleado.get('numDui').value) {
      formEmpleado.numDui = String(this.formEmpleado.get('numDui').value);
    }

    this.listadoEmpleado = [];


    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion != 30) {

      this.planillaService.obtenerEmpleados(formEmpleado).subscribe((data) => {
        this.listadoEmpleado = data;
      });

    }







  }



}

import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PlanillaService } from '../servicio/planilla.service';
import { NgbDateFRParserFormatter } from '../formatos/ngb-date-fr-parser-formatter';
import { Empleado } from '../modelo/Empleado';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { EncabezadoEmp } from '../accion-personal/modelo/EncabezadoEmp';
import { Router } from '@angular/router';
import { AccionPersonal } from '../modelo/AccionPersonal';
import { Departamentos } from '../modelo/Departamentos';
import { DepartamentosPK } from '../modelo/DepartamentosPK';
import { AccionPersonalPK } from '../modelo/AccionPersonalPK';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { constants } from 'buffer';
import Swal from 'sweetalert2';
import { Puestos } from '../modelo/Puestos';
import { PuestosPK } from '../modelo/PuestosPK';

@Component({
  selector: 'ngx-plantilla-tres',
  templateUrl: './plantilla-tres.component.html',
  styleUrls: ['./plantilla-tres.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
  ]
})
export class PlantillaTresComponent implements OnInit {


  p: number = 1;
  fechaSolicitud: NgbDateStruct;
  fechaInicial: NgbDateStruct;
  empleado: Empleado = new Empleado();
  listadoEmpleado: Array<any>;
  formEmpleado: FormGroup;
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();
  plantillaTresForm: FormGroup;
  listaPosiciones: Array<any>;
  plazaSeleccionado: any;
  listaGerencias: Array<any>;
  listaDepartamentos: Array<any> = [];
  listaPuesto: Array<any> = [];
  listarTiposPlanilla: Array<any> = [];
  listaEmpleadosInactivos: Array<any> = [];
  fechaInicioContrato: NgbDateStruct;
  fechaFinContrato: NgbDateStruct;
  listadoEmpresas: Array<any> = [];
  criterioSalario:string='V';
  porcentaje:number=0;
  listadoProgramaciones:Array<any>=[];
  programacionSeleccion:any;
  archivo: string;


  constructor(private accionPersonalService: AccionPersonalService, private fb: FormBuilder, private router: Router, public planillaService: PlanillaService, private calendar: NgbCalendar) {
    this.listaPosiciones = [];
    this.listadoEmpleado = [];
    planillaService.logueado = true;
    this.fechaSolicitud = this.calendar.getToday();
    this.fechaInicial = this.calendar.getToday();


  }

  ngOnInit(): void {
    this.listadoEmpleado = [];
    this.llenarListas();
    this.llenadoEmpleadoInicial();
    this.creaFormAccionNoAfecta();
    this.createForm();

  }

  llenarListas(): void {
    this.planillaService.obtenerPosiciones(3, 'V').subscribe(posicion => this.listaPosiciones = posicion);
    this.planillaService.obtenerDireccion(3).subscribe(gerencia => this.listaGerencias = gerencia);
    this.planillaService.obtenerPuestos(3).subscribe(puesto => this.listaPuesto = puesto);
    this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(tipoPlanilla => this.listarTiposPlanilla = tipoPlanilla);
    this.planillaService.obtenerEmpresas(3).subscribe(empresa => this.listadoEmpresas = empresa);

  }


  creaFormAccionNoAfecta() {
    this.plantillaTresForm = this.fb.group({
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

    this.planillaService.obtenerEmpleadosInactivos(objetoInactivo).subscribe(data => this.listaEmpleadosInactivos = data);


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




    this.listaEmpleadosInactivos = [];
    this.planillaService.obtenerEmpleadosInactivos(formEmpleado).subscribe((data) => {
      this.listaEmpleadosInactivos = data;
    });




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


  createForm() {
    this.formEmpleado = this.fb.group({
      codEmp: [''],
      nombre: [''],
      numDui: ['']
    });
  }


  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
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


  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;
  }

  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
    this.llenarGerencias(this.depenciaEmpleado);
  }

  llenarGerencias(valor: any) {
    this.listaDepartamentos = [];
    this.plantillaTresForm.get('gerencia').setValue(valor?.codGerencia);
    this.planillaService.obtenerDeptoByGerencia(3, valor?.codGerencia).subscribe(depart => this.listaDepartamentos = depart);
    this.plantillaTresForm.get('departamento').setValue(valor?.departamento?.departamentosPK?.codDepto);
    this.plantillaTresForm.get('puesto').setValue(valor?.puesto?.puestosPK.codPuesto);
  }


  guardarAccionTemplate3(): void {

    let accionPersonal = new AccionPersonal();

    accionPersonal.tipoAccion = this.planillaService.tipoAccionSeleccion;
    accionPersonal.empleados = this.empleado;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 30 && this.plantillaTresForm.get('empresa').value) {
      accionPersonal.empleados.codArea = Number(this.plantillaTresForm.get('empresa').value);
    }

    accionPersonal.departamentos = new Departamentos();
    accionPersonal.departamentos.departamentosPK = new DepartamentosPK();
    accionPersonal.departamentos.departamentosPK.codCia = 3;
    accionPersonal.departamentos.departamentosPK.codDepto = 52;
    accionPersonal.noCertificacion = this.plantillaTresForm.get('detalle').value;
    accionPersonal.observacion = this.plantillaTresForm.get('observacion').value;
    let cero: string = '';
    if (this.fechaSolicitud && Number(this.fechaSolicitud.month) <= 9) {
      cero = '0';
    }

    let cero2: string = '';

    if (this.fechaInicial && Number(this.fechaInicial.month) <= 9) {
      console.log('this.fechaInicial.month' + this.fechaInicial.month);
      cero2 = '0';
    }

    let cero3: string = '';

    if (this.fechaInicioContrato && Number(this.fechaInicioContrato.month) <= 9) {
      cero3 = '0';
    }

    if (this.archivo) {
      accionPersonal.archivo = this.archivo;
    }


    console.log('cero2' + cero2);

    accionPersonal.fecha = String(this.fechaSolicitud.day) + '-' + cero + String(this.fechaSolicitud.month) + '-' + String(this.fechaSolicitud.year) + ' ' + '00:00:00';

    if (this.fechaInicial) {
      let ceroDay:string;
      ceroDay='';
      if(this.fechaInicial.day<=9){
        ceroDay='0';
      }
      accionPersonal.fechaInicial = String(this.fechaInicial.year) + '-' + cero2 + String(this.fechaInicial.month) + '-' +ceroDay+String(this.fechaInicial.day);
    }

    if (this.fechaInicioContrato) {
      accionPersonal.fechaInicioContrato = String(this.fechaInicioContrato.year) + '-' + cero3 + String(this.fechaInicioContrato.month) + '-' + String(this.fechaInicioContrato.day)+ ' ' + '00:00:00';
    }

    accionPersonal.accionPersonalPK = new AccionPersonalPK();
    accionPersonal.accionPersonalPK.codCia = 3;
    accionPersonal.accionPersonalPK.codEmp = this.empleado.empleadosPK.codEmp;
    accionPersonal.accionPersonalPK.codTipoaccion = this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion;
    accionPersonal.puestos = new Puestos();
    accionPersonal.puestos.puestosPK = new PuestosPK();
    accionPersonal.puestos.puestosPK.codCia = 3;
   // accionPersonal.puestos.puestosPK.codPuesto = 127;

    if (this.empleado.salario != null) {
      accionPersonal.sueldoAnterior = Number(this.empleado.salario);
    }


    if (this.depenciaEmpleado.tiposPlanilla) {
      accionPersonal.tipoplaAnterior = Number(this.depenciaEmpleado.tiposPlanilla.tiposPlanillaPK.codTipopla);
    }

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 36 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25) {
      accionPersonal.codTipopla = Number(this.plantillaTresForm.get('cambioPlanilla').value);
    }



    if (this.plazaSeleccionado) {
      accionPersonal.codPlaza = this.plazaSeleccionado.codPlaza;
    } else {
      accionPersonal.codPlaza = this.depenciaEmpleado?.plaza?.plazaPK?.codPlaza;
    }

    if (this.plantillaTresForm.get('puesto').value) {
      accionPersonal.codPuesto= Number(this.plantillaTresForm.get('puesto').value);
      accionPersonal.codNuevoPuesto = Number(this.plantillaTresForm.get('puesto').value);
    } else {
      accionPersonal.codNuevoPuesto = Number(this.depenciaEmpleado?.puesto?.puestosPK?.codPuesto);
      accionPersonal.codPuesto= Number(this.depenciaEmpleado?.puesto?.puestosPK?.codPuesto);
    }



    if (this.plantillaTresForm.get('departamento').value) {
      accionPersonal.codDepto = Number(this.plantillaTresForm.get('departamento').value);
      accionPersonal.codDeptoNuevo = Number(this.plantillaTresForm.get('departamento').value);
    } else {
      accionPersonal.codDepto = Number(this.depenciaEmpleado?.departamento?.departamentosPK?.codDepto);
      accionPersonal.codDeptoNuevo = Number(this.depenciaEmpleado?.departamento?.departamentosPK?.codDepto);
    }


    if (this.plantillaTresForm.get('gerencia').value) {
      accionPersonal.codGerencia = Number(this.plantillaTresForm.get('gerencia').value);
    }

    if(this.criterioSalario){
      accionPersonal.formaAumento=this.criterioSalario;
    }

    if(this.programacionSeleccion){
      accionPersonal.anio=this.programacionSeleccion.anio;
    }


    if(this.programacionSeleccion){
      accionPersonal.mes=this.programacionSeleccion.mes;
    }

    if(this.programacionSeleccion){
      accionPersonal.numPlanilla=this.programacionSeleccion.numPlanilla;
    }


    if(this.criterioSalario==='V' && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25 ||  this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 7)){
      accionPersonal.cantidad=this.plantillaTresForm.get('nuevoSalario').value;
    }

    if(this.criterioSalario==='P' && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 7)){
      accionPersonal.cantidad=this.porcentaje;
    }


    if(this.plantillaTresForm.get('nuevoSalario').value && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 7)){
      accionPersonal.porcentaje=Number(this.plantillaTresForm.get('nuevoSalario').value);
    }


    if(this.depenciaEmpleado.bonificacion && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 7)){
      accionPersonal.bonificacionAct=Number(this.depenciaEmpleado.bonificacion);
    }


    if(this.plantillaTresForm.get('nuevaBonificacion').value && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 7)){
      accionPersonal.bonificacionAct=Number(this.plantillaTresForm.get('nuevaBonificacion').value);
    }

    //console.log('---------------------------');
  console.log('LO QUE MANDO' + JSON.stringify(accionPersonal));
    this.accionPersonalService.guardarAccionPersonal(accionPersonal, 'RH_HUMANOS.3', 47).subscribe(data => {
      if (data.accionPersonalPK) {
        Swal.fire('', 'Datos Guardado con exito', 'success');

        setTimeout(() => {
          this.regresar();
        }, 1500);

      }
    });



  }


  obtenerPosicion(objeto: any): void {
    this.plazaSeleccionado = objeto;
    //console.log('Plazas::' + JSON.stringify(this.plazaSeleccionado));

    if(this.plazaSeleccionado.codGerencia){
      this.plantillaTresForm.get('gerencia').setValue(Number(this.plazaSeleccionado.codGerencia));
    }

    if(this.plazaSeleccionado.departamentos){
      console.log('HOLA');
      this.planillaService.obtenerDeptoByGerencia(3, Number(this.plazaSeleccionado.codGerencia)).subscribe(depart => this.listaDepartamentos = depart);
      this.plantillaTresForm.get('departamento').setValue(Number(this.plazaSeleccionado.departamentos.departamentosPK.codDepto));
    }

    if(this.plazaSeleccionado.puestos){
      this.plantillaTresForm.get('puesto').setValue(Number(this.plazaSeleccionado.puestos.puestosPK.codPuesto));
    }



  }


  llenarDepartamentos(event) {
    let valor: number = event.target.value;
    this.planillaService.obtenerDeptoByGerencia(3, valor).subscribe(depart => this.listaDepartamentos = depart);
  }


  aplicarCriterio(valor:number){
    this.porcentaje=0;
    this.plantillaTresForm.get('nuevoSalario').reset();
    this.criterioSalario='V';
    if(valor==1){
      this.criterioSalario='P';
    }

  }


  calculoSalario():void{
    if(this.criterioSalario=='P' && this.plantillaTresForm.get('nuevoSalario').value && this.depenciaEmpleado.salario){
      this.porcentaje=this.depenciaEmpleado.salario+((Number(this.plantillaTresForm.get('nuevoSalario').value)/100)* Number(this.depenciaEmpleado.salario));
    }
  }


  obtenerProgramaciones(val){
    this.planillaService.obtenerProgramacionCloser(3,val.target.value).subscribe(
      valor=>{
        this.listadoProgramaciones=valor;
      }
    );
  }

  handleUpload(event) {
    Swal.fire('Archivo Cargado con exito');
    let baseArch: string;
    if (event.target.value) {
      const file = event.target.files[0];
      const type = file.type;
      this.changeFile(file).then((base64: string): any => {
        baseArch = base64;
        let dataArray = baseArch.split(',');
        // console.log(dataArray[1]);
        this.obtenerBase64(baseArch);
      });
    } else alert('Nothing')

  }



  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  obtenerBase64(data: any) {
    this.archivo = data;
    console.log('BASE 64 DE ARCHIVO' + data);
  }




}

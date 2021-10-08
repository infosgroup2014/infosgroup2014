import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { Empleado } from '../modelo/Empleado';
import { PlanillaService } from '../servicio/planilla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { EncabezadoEmp } from './modelo/EncabezadoEmp';
import { AccionPersonaSaveRequest } from './modelo/AccionPersonaSaveRequest';
import { TipoAccion } from './modelo/TtipoAccion';
import { TipoAccionPK } from './modelo/TipoAccionPK';
import Swal from 'sweetalert2';
import { NgbDateFRParserFormatter } from '../formatos/ngb-date-fr-parser-formatter';
import * as moment from 'moment';
import { CausasRenuncia } from './modelo/CausasRenuncia';



@Component({
  selector: 'app-accion-no-afecta-planilla',
  templateUrl: './accion-no-afecta-planilla.component.html',
  styleUrls: ['./accion-personal.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
  ]
})
export class AccionNoAfectaPlanillaComponent implements OnInit {

  diasTranscurridos: number;

  p: number = 1;

  @Input() mostrar: boolean;

  tipoAccion: TipoAccion;
  fechaSolicitud: NgbDateStruct;
  empleado: Empleado = new Empleado();
  listadoEmpleado: Array<any>;
  formEmpleado: FormGroup;
  formAccionNoAfecta: FormGroup;
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();
  listaNoAfectaPlanilla: Array<any>;
  listaMotivos: Array<any>;
  listaCausasRenuncia: Array<CausasRenuncia>;
  fechaInicial: NgbDateStruct;
  fechaFinal: NgbDateStruct;
  horas: number;
  minutos: number;
  archivo: string;
  minDate = undefined;

  constructor(private fb: FormBuilder,
    public planillaService: PlanillaService,
    private accionService: AccionPersonalService,
    private router: Router,
    private calendar: NgbCalendar
  ) {

  }

  ngOnInit(): void {
    this.fechaSolicitud = this.calendar.getToday();
    this.planillaService.logueado = true;
    this.llenadoEmpleadoInicial();
    this.createForm();
    this.accionService.obtenerNoAfectaTipoAccion(3, 'rrhh').subscribe(tipo => this.listaNoAfectaPlanilla = tipo);
    this.creaFormAccionNoAfecta();
    //this.accionService.motivos(3).subscribe(mov => this.listaMotivos = mov);
    if (this.planillaService?.tipoAccionSeleccion?.tipoAccionPK
      ?.codTipoaccion == 5 || this.planillaService?.tipoAccionSeleccion?.tipoAccionPK
        ?.codTipoaccion == 12) {
      this.accionService.obtenerCausasRenuncias(3, 'S').subscribe(mov => this.listaCausasRenuncia = mov);
    }

    console.log(this.listaCausasRenuncia);
  }



  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
  }



  llenadoEmpleadoInicial() {
    const objeto = {
      empresa: 3,
      estado: true,
    };

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

  creaFormAccionNoAfecta() {
    this.formAccionNoAfecta = this.fb.group({
      tipoAccion: ['',],
      motivo: [''],
      dias: [''],
      detalle: [''],
      observacion: [''],
      diaDispoInicial: [''],
      diasDispoFinal: [''],
      descontar: ['N']
    });
  }




  Buscar() {
    this.p = 1;
    let formEmpleado = new FormEmpleadoModel();

    formEmpleado.empresa = 3;
    formEmpleado.estado = true;

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

    this.planillaService.obtenerEmpleados(formEmpleado).subscribe((data) => {
      this.listadoEmpleado = data;
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







  obtenerEmpleado(cia: number, codigo: number) {
    this.planillaService.obtenerEmpleado(cia, codigo).subscribe((data) => {
      /* console.log('################################');
       console.log('------>EL EMPLEADO ASIG' + JSON.stringify(data));
       console.log('-------------------------------------------');*/
      this.asignarEmpleado(data);
    });


    this.planillaService.obtenerDepenciaEmpleado(cia, codigo).subscribe((valores) => {
      this.asignarDependenciaEmpleado(valores);
    });
  }

  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion != 5) {

      this.accionService.diasDevengar(3, this.empleado.empleadosPK.codEmp).subscribe(
        dias => {
          console.log('DIAS DEVENGAR:' + JSON.stringify(dias));
          this.formAccionNoAfecta.get('diaDispoInicial').setValue(Number(dias));
        }
      );


    }






  }

  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
  }


  validarNumero(e) {
    var charCode = (e.which) ? e.which : e.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public asignarHora(valor: number): void {
    this.horas = valor;
  }

  public asignarMinutos(valor: number): void {
    this.minutos = valor;
  }

  public guardarNoAfectaPlanilla(): void {
    let objetoNoAfectaPlanilla: AccionPersonaSaveRequest = new AccionPersonaSaveRequest();

    objetoNoAfectaPlanilla.empleado = new Empleado();
    objetoNoAfectaPlanilla.empleado = this.empleado;
    objetoNoAfectaPlanilla.tipoAccion = this.tipoAccion;

    if (this.formAccionNoAfecta.get('dias').value) {
      objetoNoAfectaPlanilla.dias = Number(this.formAccionNoAfecta.get('dias').value);
    }

    objetoNoAfectaPlanilla.horas = this.horas;
    objetoNoAfectaPlanilla.minutos = this.minutos;
    if (this.formAccionNoAfecta.get('detalle').value) {
      objetoNoAfectaPlanilla.noCertificacion = this.formAccionNoAfecta.get('detalle').value;
    }

    if (this.formAccionNoAfecta.get('observacion').value) {
      objetoNoAfectaPlanilla.observacion = this.formAccionNoAfecta.get('observacion').value;
    }

    objetoNoAfectaPlanilla.descontar = this.formAccionNoAfecta.get('descontar').value;



    if (this.fechaInicial) {
      objetoNoAfectaPlanilla.fechaInicial = this.fechaInicial.day + '/' + this.fechaInicial.month + '/' + this.fechaInicial.year;
    }

    if (this.fechaFinal) {
      objetoNoAfectaPlanilla.fechaFinal = this.fechaFinal.day + '/' + this.fechaFinal.month + '/' + this.fechaFinal.year;
    }


    if (this.depenciaEmpleado.puesto) {
      objetoNoAfectaPlanilla.puesto = this.depenciaEmpleado.puesto;
    }


    if (this.archivo) {
      objetoNoAfectaPlanilla.archivo = this.archivo;
    }

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion != 0) {
      objetoNoAfectaPlanilla.tipoAccion = this.planillaService.tipoAccionSeleccion;
    }

    if (this.formAccionNoAfecta.get('motivo').value) {
      objetoNoAfectaPlanilla.causaRenuncia = this.formAccionNoAfecta.get('motivo').value;
    }



    console.log('JSON TO API' +
      JSON.stringify(objetoNoAfectaPlanilla)
    );



    this.accionService.guardarAccionNoAfectaPlanilla(objetoNoAfectaPlanilla, 'RH_HUMANOS.3', 47).subscribe(
      accion => {
        console.log('REPUESTA DEL GUARDADO DE LA ACCION DE PERSONAL' + JSON.stringify(accion));
        this.limpiarFormulario();
        Swal.fire({
          title: accion.mensaje,
          text: " ",
          icon: 'success',
        }).then(function () {

        });
        ;
      }
    );
  }


  limpiarFormulario(): void {
    this.formAccionNoAfecta.reset();
    this.fechaFinal = null;
    this.fechaInicial = null;
    this.empleado = null;
    this.depenciaEmpleado = null;
    this.fechaSolicitud = null;
    this.minutos = null;
    this.horas = null;
  }

  public asignarTipoAccion(event): void {
    this.tipoAccion = new TipoAccion();
    this.tipoAccion.tipoAccionPK = new TipoAccionPK();
    this.tipoAccion.tipoAccionPK.codTipoaccion = event;
    this.tipoAccion.tipoAccionPK.codCia = 3;
    console.log(JSON.stringify(event));
    if (this.tipoAccion.tipoAccionPK.codTipoaccion === 22) {
      //this.accionService.motivos(3).subscribe(mov => this.listaMotivos = mov);
      this.accionService.obtenerCausasRenuncias(3, 'C').subscribe(mov => this.listaCausasRenuncia = mov);
    } else {
      this.listaCausasRenuncia = [];
    }

  }

  public asignarMotivos(event): void {
    console.log(JSON.stringify(event));
    let codTipoaccion = event;


    //console.log(JSON.stringify(event));

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



  restaDias(f1, f2): number {
    var aFecha1 = f1.split('/');
    var aFecha2 = f2.split('/');
    var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
  }


  deshabilitarDiasCalendario() {

  }


  changeCalculoDias(valor: any): void {
    console.log('DIAS:' + JSON.stringify(valor));
    console.log('dias:' + JSON.stringify(this.fechaInicial));



    var fechaInicialStr: string = '';
    var fechaFinalStr: string = '';


    if (this.fechaInicial) {

      if (this.fechaInicial.month < 10) {
        fechaInicialStr = this.fechaInicial.year + '-' + '0' + this.fechaInicial.month + '-' + this.fechaInicial.day;
      } else {
        fechaInicialStr = this.fechaInicial.year + '-' + this.fechaInicial.month + '-' + this.fechaInicial.day;
      }

    }

    if (valor) {

      if (valor.month < 10) {
        fechaFinalStr = valor.year + '-' + '0' + valor.month + '-' + valor.day;
      } else {
        fechaFinalStr = valor.year + '-' + valor.month + '-' + valor.day;
      }

    }



    var fecha1 = moment(fechaInicialStr);
    var fecha2 = moment(fechaFinalStr);

    this.formAccionNoAfecta.controls['dias'].setValue(fecha2.diff(fecha1, 'days') + 1);

    let diasFinal: number = this.formAccionNoAfecta.get('diaDispoInicial').value;
    let diasInicio: number = this.formAccionNoAfecta.get('dias').value;

    let diasTotalizado: number = diasFinal - diasInicio;

    this.formAccionNoAfecta.get('diasDispoFinal').setValue(diasTotalizado);


    console.log(fecha2.diff(fecha1, 'days'), ' dias de diferencia');

  }




}

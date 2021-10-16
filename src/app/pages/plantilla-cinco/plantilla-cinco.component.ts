import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PlanillaService } from '../servicio/planilla.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { AccionPersonal } from '../modelo/AccionPersonal';
import { AccionPersonalPK } from '../modelo/AccionPersonalPK';
import Swal from 'sweetalert2';
import { Empleado } from '../modelo/Empleado';

@Component({
  selector: 'ngx-plantilla-cinco',
  templateUrl: './plantilla-cinco.component.html',
  styleUrls: ['./plantilla-cinco.component.css']
})
export class PlantillaCincoComponent implements OnInit {


  fechaSolicitud: NgbDateStruct;
  fechaInicial: NgbDateStruct;
  fechaFin: NgbDateStruct;
  fechaInicioReal: NgbDateStruct;
  fechaFinReal: NgbDateStruct;
  dias: number;
  criterioAplicar: string;
  plantillaCincoForm: FormGroup;
  criterioAplicado: number;
  descontarPlanilla: number;
  mostrarDeptoCriterios: boolean = false;
  listaDepartamentos: Array<any>;
  listaTiposPlanilla: Array<any> = [];
  listadoProgramaciones: Array<any> = [];
  programacionSeleccionada: any;
  cantidadEmpleadosAfectados: number;
  listadoEmpleadosByDepto: Array<Empleado> = [];
  listadoEmpleadosAfectados: Array<Empleado> = [];

  criterioSalario: string = 'V';
  porcentaje: number = 0;
  archivo: string;

  constructor(private accionPersonalService: AccionPersonalService, private fb: FormBuilder, private router: Router, public planillaService: PlanillaService, private calendar: NgbCalendar) {
    planillaService.logueado = true;
    this.fechaSolicitud = calendar.getToday();
  }

  ngOnInit(): void {
    this.llenarLista();
    this.creaFormAccionNoAfecta();
  }

  creaFormAccionNoAfecta() {
    this.plantillaCincoForm = this.fb.group({
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
      nuevoSalario: [''],
      nuevaBonificacion: [],
      retiroAccion: [''],
      motivoRenuncia: [''],
      programacion: [''],
      horas: [''],
      minutos: [''],
      valorInicial: [''],
      valorFinal: ['']


    });
  }

  llenarLista() {
    this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(data => this.listaTiposPlanilla = data);
    this.planillaService.obtenerDepartamento(3).subscribe(data => this.listaDepartamentos = data);
  }


  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
  }


  mostrarCriterio(valor) {
    this.mostrarDeptoCriterios = false;

    if (valor && Number(valor) === 1) {
      this.mostrarDeptoCriterios = true;
      console.log('ingreso ' + this.mostrarDeptoCriterios);
    } else if (valor && Number(valor) === 3) {
      this.mostrarDeptoCriterios = true;
    }


  }

  obtenerProgramaciones(valor) {

    if (valor)
      this.planillaService.obtenerProgramacionCloser(3, Number(valor)).subscribe(prg => this.listadoProgramaciones = prg);


  }



  asignarEmpleadosAfectados(valor: number) {
    this.callAfectados(valor);
  }

  callAfectados(val) {

    this.planillaService.obtenerEmpleadosAfectadosDepto(3, Number(val)).subscribe(data => this.cantidadEmpleadosAfectados = data)
    this.planillaService.obtenerEmpleadosByDepto(3, Number(val)).subscribe(data => this.listadoEmpleadosByDepto = data);

  }

  callAfectadosByRango() {
    let inicial = this.plantillaCincoForm.get('valorInicial').value;
    let final = this.plantillaCincoForm.get('valorFinal').value;
    if (inicial && final) {
      console.log('Entro a consulta por rango');
      this.planillaService.obtenerEmpleadosByRango(3, Number(inicial), Number(final)).subscribe(data => {
        this.listadoEmpleadosByDepto = data;
        this.cantidadEmpleadosAfectados = this.listadoEmpleadosByDepto.length;
      });

    }
  }

  checkValueEmpleado(values: any, emp: Empleado) {
    console.log('EMPLEADO ASIG ' + JSON.stringify(values));
    console.log(JSON.stringify(emp));
    let empleado = this.listadoEmpleadosAfectados.filter(empleado => empleado.empleadosPK.codEmp === emp.empleadosPK.codEmp);
    console.log(empleado);
    if (empleado && empleado.length === 0) {
      this.listadoEmpleadosAfectados.push(emp);
    } else {
      this.listadoEmpleadosAfectados = this.listadoEmpleadosAfectados.filter(empleado => empleado.empleadosPK.codEmp !== emp.empleadosPK.codEmp);
    }
    console.log(this.listadoEmpleadosAfectados);
    this.cantidadEmpleadosAfectados = this.listadoEmpleadosAfectados.length;
  }

  aplicarCriterio(valor: number) {
    this.porcentaje = 0;
    this.plantillaCincoForm.get('nuevoSalario').reset();
    this.criterioSalario = 'V';
    if (valor == 1) {
      this.criterioSalario = 'P';
    }

  }

  guardarAccion(): void {

    let accionPersonal = new AccionPersonal();

    accionPersonal.tipoAccion = this.planillaService.tipoAccionSeleccion;
    //accionPersonal.empleados = this.empleado;
    accionPersonal.noCertificacion = this.plantillaCincoForm.get('detalle').value;
    accionPersonal.observacion = this.plantillaCincoForm.get('observacion').value;
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

    if (this.archivo) {
      accionPersonal.archivo = this.archivo;
    }


    console.log('cero2' + cero2);

    accionPersonal.fecha = String(this.fechaSolicitud.day) + '-' + cero + String(this.fechaSolicitud.month) + '-' + String(this.fechaSolicitud.year) + ' ' + '00:00:00';

    if (this.fechaInicial) {
      let ceroDay: string;
      ceroDay = '';
      if (this.fechaInicial.day <= 9) {
        ceroDay = '0';
      }
      accionPersonal.fechaInicial = ceroDay + String(this.fechaInicial.day) + '-' + cero2 + String(this.fechaInicial.month) + '-' + String(this.fechaInicial.year) + ' ' + '00:00:00';
    }


    accionPersonal.accionPersonalPK = new AccionPersonalPK();
    accionPersonal.accionPersonalPK.codCia = 3;
    //accionPersonal.accionPersonalPK.codEmp = this.empleado.empleadosPK.codEmp;
    accionPersonal.accionPersonalPK.codTipoaccion = this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion;
    // accionPersonal.puestos.puestosPK.codPuesto = 127;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 36 || this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 25) {
      accionPersonal.codTipopla = Number(this.plantillaCincoForm.get('cambioPlanilla').value);
    }

    if (this.criterioSalario) {
      accionPersonal.formaAumento = this.criterioSalario;
    }

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 18) {
      accionPersonal.cantidad = this.plantillaCincoForm.get('nuevoSalario').value;
    }

    if (this.criterioSalario === 'P' && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 18)) {
      accionPersonal.cantidad = this.porcentaje;
    }

    if (this.plantillaCincoForm.get('nuevaBonificacion').value && (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 18)) {
      accionPersonal.bonificacionAct = Number(this.plantillaCincoForm.get('nuevaBonificacion').value);
    }

    if (this.programacionSeleccionada) {
      accionPersonal.anio = this.programacionSeleccionada.anio;
      accionPersonal.mes = this.programacionSeleccionada.mes;
      accionPersonal.numPlanilla = this.programacionSeleccionada.numPlanilla;
    }

    accionPersonal.empleadosAfectados = this.listadoEmpleadosAfectados;


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

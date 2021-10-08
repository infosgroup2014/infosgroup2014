import { Component, OnInit } from '@angular/core';
import { PlanillaService } from '../servicio/planilla.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Empleado } from '../modelo/Empleado';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { Router } from '@angular/router';
import { NgbDateFRParserFormatter } from '../formatos/ngb-date-fr-parser-formatter';
import { EncabezadoEmp } from '../accion-personal/modelo/EncabezadoEmp';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { AccionPersonal } from '../modelo/AccionPersonal';
import { Departamentos } from '../modelo/Departamentos';
import { DepartamentosPK } from '../modelo/DepartamentosPK';
import { AccionPersonalPK } from '../modelo/AccionPersonalPK';
import { json } from 'd3';
import { NbIconConfig, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-plantilla-dos',
  templateUrl: './plantilla-dos.component.html',
  styleUrls: ['./plantilla-dos.component.css'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
  ]
})
export class PlantillaDosComponent implements OnInit {

  p: number = 1;
  plantillaDosForm: FormGroup;
  fechaSolicitud: NgbDateStruct;
  empleado: Empleado = new Empleado();
  formEmpleado: FormGroup;
  listadoEmpleado: Array<any>;
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();
  listaIncapacidad: Array<any> = [];
  fechaInicioAplica: NgbDateStruct;
  fechaInicio: NgbDateStruct;
  fechaFinAplica: NgbDateStruct;
  fechaFin: NgbDateStruct;
  archivo: string;



  constructor(private toastrService: NbToastrService, private router: Router, public planillaService: PlanillaService, private accionPersonalService: AccionPersonalService, private fb: FormBuilder, private calendar: NgbCalendar) {
    planillaService.logueado = true;
    this.fechaSolicitud = this.calendar.getToday();

  }

  ngOnInit(): void {

    this.llenadoEmpleadoInicial();
    this.createForm();
    this.llenarListados();
    this.creaFormAccionNoAfecta();
  }


  creaFormAccionNoAfecta() {
    this.plantillaDosForm = this.fb.group({
      tipoAccion: ['', [Validators.required]],
      motivo: [''],
      dias: [''],
      detalle: [''],
      observacion: [''],
      incapacidad: [''],
      institucion: [''],
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

  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;
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

  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
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

  llenarListados(): void {

    this.planillaService.obtenerIncapacidades(3).subscribe(
      data => {
        this.listaIncapacidad = data;
      }
    );
  }


  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
  }

  createForm() {
    this.formEmpleado = this.fb.group({
      codEmp: [''],
      nombre: [''],
      numDui: ['']
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


  llenarFechaInicios(valor: any) {
    this.fechaInicio = this.calendar.getToday();
    console.log(JSON.stringify(valor));
    this.fechaInicio.year = valor.year;
    this.fechaInicio.month = valor.month;
    this.fechaInicio.day = valor.day;


  }


  llenarFechaFin(valor: any) {
    this.fechaFin = this.calendar.getToday();
    console.log(JSON.stringify(valor));
    this.fechaFin.year = valor.year;
    this.fechaFin.month = valor.month;
    this.fechaFin.day = valor.day;
  }


  changeCalculoDias(valor: any): void {
    console.log('DIAS:' + JSON.stringify(valor));
    console.log('dias:' + JSON.stringify(this.fechaInicioAplica));



    var fechaInicialStr: string = '';
    var fechaFinalStr: string = '';


    if (this.fechaInicioAplica) {

      if (this.fechaInicioAplica.month < 10) {
        fechaInicialStr = this.fechaInicioAplica.year + '-' + '0' + this.fechaInicioAplica.month + '-' + this.fechaInicioAplica.day;
      } else {
        fechaInicialStr = this.fechaInicioAplica.year + '-' + this.fechaInicioAplica.month + '-' + this.fechaInicioAplica.day;
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

    let dias: number = Number(fecha2.diff(fecha1, 'days'));
    this.plantillaDosForm.controls['dias'].setValue(dias + 1);






    let iconName: any = 'info-outline';
    const iconConfig: NbIconConfig = { icon: iconName, pack: 'eva' };

    var isAfter = moment(fecha1).isAfter(fecha2);


    if (isAfter) {
      this.plantillaDosForm.controls['dias'].setValue(0);
      this.toastrService.show('', `la fecha final no puede ser menor a la fecha inicial`, iconConfig);
    }



  }







  guardarAccionTemplate2() {

    let accionPersonal = new AccionPersonal();

    accionPersonal.tipoAccion = this.planillaService.tipoAccionSeleccion;
    accionPersonal.empleados = this.empleado;
    accionPersonal.departamentos = new Departamentos();
    accionPersonal.departamentos.departamentosPK = new DepartamentosPK();
    accionPersonal.departamentos.departamentosPK.codCia = 3;
    accionPersonal.departamentos.departamentosPK.codDepto = 52;
    accionPersonal.institucion = this.plantillaDosForm.get('institucion').value;
    accionPersonal.codTipoIncapacidad = Number(this.plantillaDosForm.get('incapacidad').value);
    let mes: string = '';
    if (this.fechaInicioAplica) {
      if (this.fechaInicioAplica.month <= 9) {
        mes = '0';
      }
      let dia = '';
      if (this.fechaInicioAplica.day <= 9) {
        dia = '0';
      }

      accionPersonal.fechaInicial = dia + String(this.fechaInicioAplica.day) + '-' + mes + String(this.fechaInicioAplica.month) + '-' + String(this.fechaInicioAplica.year) + ' ' + '00:00:00';

    }

    let mes2: string = '';
    if (this.fechaInicio) {
      if (this.fechaInicio.month <= 9) {
        mes2 = '0';
      }

      let dia = '';
      if (this.fechaInicio.day <= 9) {
        dia = '0';
      }


      accionPersonal.periodo = dia + this.fechaInicio.day + '-' + mes2 + this.fechaInicio.month + '-' + this.fechaInicio.year + ' ' + '00:00:00';

    }

    let mes3: string = '';
    if (this.fechaFinAplica) {
      if (this.fechaFinAplica.month <= 9) {
        mes3 = '0';
      }
      let dia = '';
      if (this.fechaFinAplica.day <= 9) {
        dia = '0';
      }
      accionPersonal.fechaFinal = this.fechaFinAplica.day + '-' + mes3 + this.fechaFinAplica.month + '-' + dia + this.fechaFinAplica.year + ' ' + '00:00:00';
    }

    let mes4: string = '';
    if (this.fechaFin) {
      if (this.fechaFin.month <= 9) {
        mes4 = '0';
      }
      let dia = '';
      if (this.fechaFin.day <= 9) {
        dia = '0';
      }
      accionPersonal.periodoFinal = this.fechaFin.day + '-' + mes4 + this.fechaFin.month + '-' + dia + this.fechaFin.year + ' ' + '00:00:00';

    }

    accionPersonal.dias = Number(this.plantillaDosForm.get('dias').value);
    accionPersonal.observacion = this.plantillaDosForm.get('observacion').value;
    accionPersonal.noCertificacion = this.plantillaDosForm.get('detalle').value;
    accionPersonal.accionPersonalPK = new AccionPersonalPK();
    accionPersonal.accionPersonalPK.codCia = 3;
    accionPersonal.accionPersonalPK.codEmp = this.empleado.empleadosPK.codEmp;
    accionPersonal.accionPersonalPK.codTipoaccion = this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion;

    if (this.archivo) {
      accionPersonal.archivo = this.archivo;
    }




    console.log('JSON A GUARDAR ACCION:' + JSON.stringify(accionPersonal));

    this.accionPersonalService.guardarAccionPersonal(accionPersonal, 'RH_HUMANOS.3', 47).subscribe(

      data => {
        console.log(data);
        Swal.fire('Accion Realizada', 'Exitosamente', 'success');
        setTimeout(() => {
          this.regresar();
        }, 1500);
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

import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PlanillaService } from '../servicio/planilla.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { Empleado } from '../modelo/Empleado';
import { EncabezadoEmp } from '../accion-personal/modelo/EncabezadoEmp';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { AccionPersonal } from '../modelo/AccionPersonal';
import { Departamentos } from '../modelo/Departamentos';
import { DepartamentosPK } from '../modelo/DepartamentosPK';
import { AccionPersonalPK } from '../modelo/AccionPersonalPK';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-plantilla-cuatro',
  templateUrl: './plantilla-cuatro.component.html',
  styleUrls: ['./plantilla-cuatro.component.css']
})
export class PlantillaCuatroComponent implements OnInit {

  p: number = 1;
  fechaSolicitud: NgbDateStruct;
  fechaRetiro: NgbDateStruct;
  empleado: Empleado = new Empleado();
  listadoEmpleado: Array<any>;
  formEmpleado: FormGroup;
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();
  plantillaCuatroForm: FormGroup;
  plazaSeleccionado: any;
  listarTipoAccionRetiro: Array<any> = [];
  listadoCausas: Array<any> = [];
  listaTiposPlanilla: Array<any> = [];
  archivo: string;



  constructor(private accionPersonalService: AccionPersonalService, private fb: FormBuilder, private router: Router, public planillaService: PlanillaService, private calendar: NgbCalendar) {
    this.planillaService.logueado = true;
    this.fechaSolicitud = this.calendar.getToday();


  }

  ngOnInit(): void {

    this.listadoEmpleado = [];

    this.llenadoEmpleadoInicial();
    this.creaFormAccionNoAfecta();
    this.createForm();
    this.llenarListas();

  }


  llenarListas() {

    if (this.planillaService?.tipoAccionSeleccion?.tipoAccionPK?.codTipoaccion == 19) {
      this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(
        plaPrg => {
          this.listaTiposPlanilla = plaPrg;
          return this.listaTiposPlanilla = this.listaTiposPlanilla.filter(elemento => elemento.tiposPlanillaPK.codTipopla == 5);
        }
      );
    }

    this.accionPersonalService.obtenerTipoAccionRetiro(3).subscribe(retiro => this.listarTipoAccionRetiro = retiro);
  }

  llenarCausas(event: number) {

    let valor: number;

    valor = Number(event);
    //console.log('Valores:' + valor);


    switch (valor) {
      case 10:
        this.accionPersonalService.obtenerCausasRenuncias(3, 'D').subscribe(cr => this.listadoCausas = cr);
        break;

      case 15:
        this.accionPersonalService.obtenerCausasRenuncias(3, 'R').subscribe(cr => this.listadoCausas = cr);
        break;

      case 16:

        this.accionPersonalService.obtenerCausasRenuncias(3, 'A').subscribe(cr => this.listadoCausas = cr);
        break;

      case 34:
        this.accionPersonalService.obtenerCausasRenuncias(3, 'D').subscribe(cr => this.listadoCausas = cr);
        break;

      case 35:
        this.accionPersonalService.obtenerCausasRenuncias(3, 'R').subscribe(cr => this.listadoCausas = cr);
        break;

      case 39:
        this.accionPersonalService.obtenerCausasRenuncias(3, 'F').subscribe(cr => this.listadoCausas = cr);
        break;

      default:
        console.log("No such accion exists!");
        break;
    }



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



  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;
  }

  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
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



  creaFormAccionNoAfecta() {
    this.plantillaCuatroForm = this.fb.group({
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
      motivoRenuncia: ['']

    });
  }



  guardarAccionTemplate4() {



    let accionPersonal = new AccionPersonal();

    accionPersonal.tipoAccion = this.planillaService.tipoAccionSeleccion;
    accionPersonal.empleados = this.empleado;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 30 && this.plantillaCuatroForm.get('empresa').value) {
      accionPersonal.empleados.codArea = Number(this.plantillaCuatroForm.get('empresa').value);
    }

    accionPersonal.departamentos = new Departamentos();
    accionPersonal.departamentos.departamentosPK = new DepartamentosPK();
    accionPersonal.departamentos.departamentosPK.codCia = 3;
    accionPersonal.departamentos.departamentosPK.codDepto = 52;
    accionPersonal.noCertificacion = this.plantillaCuatroForm.get('detalle').value;
    accionPersonal.observacion = this.plantillaCuatroForm.get('observacion').value;
    let cero: string = '';
    if (this.fechaSolicitud && Number(this.fechaSolicitud.month) <= 9) {
      cero = '0';
    }


    let cero2: string = '';

    if (this.fechaRetiro && Number(this.fechaRetiro.month) <= 9) {
      console.log('this.fechaInicial.month' + this.fechaRetiro.month);
      cero2 = '0';
    }

    console.log('cero2' + cero2);

    accionPersonal.fecha = String(this.fechaSolicitud.day) + '-' + cero + String(this.fechaSolicitud.month) + '-' + String(this.fechaSolicitud.year) + ' ' + '00:00:00';

    if (this.fechaRetiro) {
      let dia = '';
      if (this.fechaRetiro.day <= 9) {
        dia = '0';
      }
      accionPersonal.fechaInicial = dia + String(this.fechaRetiro.day) + '-' + cero2 + String(this.fechaRetiro.month) + '-' + String(this.fechaRetiro.year) + ' ' + '00:00:00';
    }

    if (this.plantillaCuatroForm.get('cambioPlanilla').value) {
      accionPersonal.codTipopla = Number(this.plantillaCuatroForm.get('cambioPlanilla').value);
    }


    if (this.plantillaCuatroForm.get('motivoRenuncia').value) {
      accionPersonal.codTiporetiro = Number(this.plantillaCuatroForm.get('motivoRenuncia').value);
    }

    accionPersonal.accionPersonalPK = new AccionPersonalPK();
    accionPersonal.accionPersonalPK.codCia = 3;
    accionPersonal.accionPersonalPK.codEmp = this.empleado.empleadosPK.codEmp;

    if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion == 19) {
      accionPersonal.accionPersonalPK.codTipoaccion = Number(this.plantillaCuatroForm.get('retiroAccion').value);
    } else {
      accionPersonal.accionPersonalPK.codTipoaccion = this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion;
    }



    if (this.plantillaCuatroForm.get('puesto').value) {
      accionPersonal.codNuevoPuesto = Number(this.plantillaCuatroForm.get('puesto').value);
    } else {
      accionPersonal.codNuevoPuesto = Number(this.depenciaEmpleado?.puesto?.puestosPK?.codPuesto);
    }

    if (this.plantillaCuatroForm.get('departamento').value) {
      accionPersonal.codDeptoNuevo = Number(this.plantillaCuatroForm.get('departamento').value);
    } else {
      accionPersonal.codDeptoNuevo = Number(this.depenciaEmpleado?.departamento?.departamentosPK?.codDepto);
    }

    if (this.archivo) {
      accionPersonal.archivo = this.archivo;
    }


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

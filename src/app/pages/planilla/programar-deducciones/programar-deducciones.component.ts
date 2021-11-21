import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PlanillaService } from '../../servicio/planilla.service';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormEmpleadoModel } from '../../modelo/formEmpleadoModel';
import { Empleado } from '../../modelo/Empleado';
import { EncabezadoEmp } from '../../modelo/EncabezadoEmp';

@Component({
  selector: 'ngx-programar-deducciones',
  templateUrl: './programar-deducciones.component.html',
  styleUrls: ['./programar-deducciones.component.scss']
})
export class ProgramarDeduccionesComponent implements OnInit {

  ProgramarDeduccionesForm: FormGroup;
  BuscarEmpleadoForm: FormGroup;
  p: number = 1;
  listadoEmpleado: Array<any>;
  fechaCancelacion: NgbDateStruct;
  fechaInicio: NgbDateStruct;
  empleado: Empleado = new Empleado();
  depenciaEmpleado: EncabezadoEmp = new EncabezadoEmp();

  constructor(private servicioPlanilla: PlanillaService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.servicioPlanilla.logueado=true;
    this.llenadoEmpleadoInicial();
  }

  filtroPrestamo() {
    //this.listadoPlanilla = [];
    //this.servicioPlanilla.obtenerPlanillas(this.mesConsulta, this.anioConsulta).subscribe((dat) => {
      // console.log(JSON.stringify(dat));
    //  this.listadoPlanilla = dat;
   // });
  }

  llenadoEmpleadoInicial() {
    const objeto = {
      empresa: 3,
      estado: true,
    };

    this.servicioPlanilla.obtenerEmpleados(objeto).subscribe((data) => {
      this.listadoEmpleado = data;
    });
  }

  obtenerEmpleado(cia: number, codigo: number) {
    this.servicioPlanilla.obtenerEmpleado(cia, codigo).subscribe((data) => {
      this.asignarEmpleado(data);
    });

    this.servicioPlanilla.obtenerDepenciaEmpleado(cia, codigo).subscribe((valores) => {
      this.asignarDependenciaEmpleado(valores);
    });
  }
  public asignarEmpleado(valor: Empleado): void {
    this.empleado = valor;
    /*if (this.planillaService.tipoAccionSeleccion.tipoAccionPK.codTipoaccion != 5) {
      this.accionService.diasDevengar(3, this.empleado.empleadosPK.codEmp).subscribe(
        dias => {
          console.log('DIAS DEVENGAR:' + JSON.stringify(dias));
          this.formAccionNoAfecta.get('diaDispoInicial').setValue(Number(dias));
        }
      );
    }*/
  }

  public asignarDependenciaEmpleado(data: any): void {
    this.depenciaEmpleado = data;
  }

  createForm() {
    this.BuscarEmpleadoForm = this.fb.group({
      codEmp: [''],
      nombre: [''],
      numDui: ['']
    });
  }

  Buscar() {
    this.p = 1;
    let BuscarEmpleadoForm = new FormEmpleadoModel();

    BuscarEmpleadoForm.empresa = 3;
    BuscarEmpleadoForm.estado = true;

    if (this.BuscarEmpleadoForm.get('codEmp').value) {
      BuscarEmpleadoForm.codEmp = Number(this.BuscarEmpleadoForm.get('codEmp').value);
    }

    if (this.BuscarEmpleadoForm.get('nombre').value) {
      BuscarEmpleadoForm.nombre = String(this.BuscarEmpleadoForm.get('nombre').value);
    }

    if (this.BuscarEmpleadoForm.get('numDui').value) {
      BuscarEmpleadoForm.numDui = String(this.BuscarEmpleadoForm.get('numDui').value);
    }

    this.listadoEmpleado = [];

    this.servicioPlanilla.obtenerEmpleados(BuscarEmpleadoForm).subscribe((data) => {
      this.listadoEmpleado = data;
    });
  }

  limpiar() {
    this.BuscarEmpleadoForm.reset();
    const objeto = {
      empresa: 3,
      estado: true
    };

    this.listadoEmpleado = [];

    this.servicioPlanilla.obtenerEmpleados(objeto).subscribe((data) => {
      this.listadoEmpleado = data;
    });
  }

}

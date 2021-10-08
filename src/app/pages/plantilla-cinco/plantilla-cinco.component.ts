import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PlanillaService } from '../servicio/planilla.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccionPersonalService } from '../servicio/accion-personal.service';

@Component({
  selector: 'ngx-plantilla-cinco',
  templateUrl: './plantilla-cinco.component.html',
  styleUrls: ['./plantilla-cinco.component.css']
})
export class PlantillaCincoComponent implements OnInit {


  fechaSolicitud: NgbDateStruct;
  fechaInicial: NgbDateStruct;
  fechaFin: NgbDateStruct;
  fechaInicioReal:NgbDateStruct;
  fechaFinReal:NgbDateStruct;
  dias:number;
  criterioAplicar:string;
  plantillaCincoForm: FormGroup;
  criterioAplicado:number;
  descontarPlanilla:number;
  mostrarDeptoCriterios:boolean=false;
  listaDepartamentos:Array<any>;
  listaTiposPlanilla:Array<any>=[];
  listadoProgramaciones:Array<any>=[];
  programacionSeleccionada:any;
  cantidadEmpleadosAfectados:number;
  listadoEmpleadosByDepto:Array<any>=[];

  constructor(private accionPersonalService: AccionPersonalService, private fb: FormBuilder, private router: Router, public planillaService: PlanillaService, private calendar: NgbCalendar) {
    planillaService.logueado=true;
    this.fechaSolicitud=calendar.getToday();
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
      programacion:[''],
      horas:[''],
      minutos:[''],


    });
  }

  llenarLista(){
    this.planillaService.obtenerTiposPlanilla(3,2).subscribe(data=>this.listaTiposPlanilla=data);
    this.planillaService.obtenerDepartamento(3).subscribe(data=>this.listaDepartamentos=data);
  }


  public regresar(): void {
    this.router.navigate(['/pages/accion-personal-crear']);
  }


  mostrarCriterio(valor){
    this.mostrarDeptoCriterios=false;

    if(valor && Number(valor)===1){
      this.mostrarDeptoCriterios=true;
      console.log('ingreso '+this.mostrarDeptoCriterios);
    }else if(valor && Number(valor)===3){
      this.mostrarDeptoCriterios=true;
    }


  }

  obtenerProgramaciones(valor){

    if(valor)
    this.planillaService.obtenerProgramacionCloser(3,Number(valor)).subscribe(prg=>this.listadoProgramaciones=prg);


  }



  asignarEmpleadosAfectados(valor:number){
    this.callAfectados(valor);
  }

  callAfectados(val){

    this.planillaService.obtenerEmpleadosAfectadosDepto(3,Number(val)).subscribe(data=>this.cantidadEmpleadosAfectados=data)
    this.planillaService.obtenerEmpleadosByDepto(3,Number(val)).subscribe(data=>this.listadoEmpleadosByDepto=data);

  }

  checkValueEmpleado(values: any,empleado:any){
    console.log('EMPLEADO ASIG');
console.log(JSON.stringify(empleado));
  }

}

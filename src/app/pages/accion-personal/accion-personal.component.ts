import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { PlanillaService } from '../servicio/planilla.service';

@Component({
  selector: 'app-accion-personal',
  templateUrl: './accion-personal.component.html',
  styleUrls: ['./accion-personal.component.css']
})
export class AccionPersonalComponent implements OnInit {

    p: number = 1;

    listaObtenerAccionPersonal:Array<any>;


    constructor(private accionService:AccionPersonalService,private route:Router,private planillaService:PlanillaService) {
        this.inicializarListaAcciones();
  }

  ngOnInit(): void {
    this.inicializarListaAcciones();
    this.planillaService.logueado=true;

  }


  inicializarListaAcciones(){
    const objetoPredeterminado={
        empleadosPK:{
            codCia:3,
            codEmp:333
       },
       usuario:"rh_humanos.3",
       rol:2
    };


    this.accionService.obtenerAccionPersonalList(objetoPredeterminado).subscribe(
        data=>{
            console.log('Listado'+JSON.stringify(data));
                    this.listaObtenerAccionPersonal=data;
        }
    );
  }

 public  crearAccionPersonal():void{
    this.route.navigate(['./pages/accion-personal-crear']);
  }




}

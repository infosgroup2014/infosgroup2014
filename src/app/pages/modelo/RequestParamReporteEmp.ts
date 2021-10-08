import { Empleado } from "./Empleado";

export class RequestParamReporteEmp{

     empleado:Empleado;
     formato:string;
     firmas:number;
     fecha:string;
     anioReporte:string;
     archivo:string;
     tipo:number;

     constructor(){
         this.empleado=new Empleado();
     }



}

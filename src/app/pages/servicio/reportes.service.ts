import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ArchivoNBRequest } from '../modelo/ArchivoNBRequest';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {


  baseUrl:any='http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/';

  baseUrlParametros:any='http://138.128.245.244:8447/infosweb/api/v1/core/parametros/';

  baseUrlPlanilla:any='http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/';

  constructor(private http:HttpClient) { }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }



  generarArchivoBanco(objeto:ArchivoNBRequest):Observable<any>{
    return this.http.post(this.baseUrl+'reportes/generar-archivo-banco/'+objeto.programacionPrincipal.programacionPlaPK.codCia+'/'+objeto.programacionPrincipal.anio+'/'+objeto.programacionPrincipal.programacionPlaPK.secuencia+'/'+objeto.programacionPrincipal.tiposPlanilla.tiposPlanillaPK.codTipopla,objeto).pipe(catchError(this.handleError));
  }


  generarReportePlanilla(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get(this.baseUrl+'reportes/generar-reporte-planilla/'+cia+'/'+anio+'/'+secuencia+'/'+tipo).pipe(catchError(this.handleError));
  }


  generarReporteDeducciones(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get(this.baseUrl+'reportes/generar-reporte-deduc/'+cia+'/'+anio+'/'+secuencia+'/'+tipo).pipe(catchError(this.handleError));
  }


  generarReportePagoEfectivo(cia:any,anio:any,secuencia:any,tipo:any):Observable<any>{
    return this.http.get(this.baseUrl+'reportes/generar-reporte-pago-efectivo/'+cia+'/'+anio+'/'+secuencia+'/'+tipo).pipe(catchError(this.handleError));
  }




  obtenerTiposReportes(cia:any,modulo:string,reporte:number):Observable<any>{
    return this.http.get(this.baseUrlParametros+'obtener-tipo-formato-by-planilla/'+cia+'/'+reporte+'/'+modulo).pipe(catchError(this.handleError));
  }



  generarReporteBoletas(cia:any,anio:any,secuencia:any,tipo:any,nombre:string):Observable<any>{
    return this.http.get('http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/reportes/generar-boletas-pago/'+cia+'/'+anio+'/'+secuencia+'/'+tipo+'/'+nombre).pipe(catchError(this.handleError));
  }


  generarReporteSolicitud(cia:any,candidato:any):Observable<any>{
    return this.http.get(this.baseUrl+'reportes/generar-rep-solicitud/'+cia+'/'+candidato).pipe(catchError(this.handleError));
  }




}

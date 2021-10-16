import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AcademicaService {

  //  baseUrlParametros: any = 'http://138.128.245.244:8447/infosweb/api/v1/core/parametros/';
    baseUrlCatalogosAcadem: any = 'http://138.128.245.244:8448/infosweb/api/v1/rrhh/catalogos/';
    baseUrlEmpleados: any = 'http://138.128.245.244:8449/infosweb/api/v1/rrhh/empleados/';


    constructor(private http: HttpClient) {
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //window.alert(errorMessage);
        console.log('ERROR EN LOS SERVIVIOS' + errorMessage);
        return throwError(errorMessage);
    }

    obtenerNivelAcademico(cia: any): Observable<any> {
        return this.http.get(this.baseUrlCatalogosAcadem + 'listar-nivel-academico/' + cia).pipe(catchError(this.handleError));
    }

    obtenerCapacitaciones(cia: number, emp : number): Observable<any> {
      return this.http.get(this.baseUrlEmpleados + 'find-capacitaciones-x-emp/' + cia+'/'+emp).pipe(catchError(this.handleError));
  }


    obtenerProfesionAcadem(cia: any): Observable<any> {
        return this.http.get(this.baseUrlCatalogosAcadem + 'listar-profesion/' + cia).pipe(catchError(this.handleError));
    }

    obtenerPrepAcademica(cia: any, emp: any): Observable<any> {
        return this.http.get(this.baseUrlEmpleados + 'find-nivel-x-emp/' + cia + '/' + emp);
    }

    /*
    obtenerMuniDeptoPais(pais: number, deptop: number): Observable<any> {
        console.log('lo que mando:'+pais);
        console.log('lo que mando'+deptop);
        return this.http.get(this.baseUrlParametros + 'obtener-municipio-by-pais-depto' + '/' + pais + '/' + deptop).pipe(catchError(this.handleError));

    }

    obtenerDeptoPais(pais: number): Observable<any> {
        return this.http.get(this.baseUrlParametros + 'obtener-deptos-by-pais' + '/' + pais).pipe(catchError(this.handleError));

    }

    obtenerPaises(): Observable<any> {
        return this.http.get(this.baseUrlParametros + 'obtener-paises').pipe(catchError(this.handleError));
    }*/

}

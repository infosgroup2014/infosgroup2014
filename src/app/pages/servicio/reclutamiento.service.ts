import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NivelesXCandidatoPK } from "../candidato/preparacion-academica/modelo/nivelesXCandidatoPK";
import { NivelesXCandidato } from "../candidato/preparacion-academica/modelo/nivelesXCandidato";

@Injectable({
    providedIn: 'root'
})
export class ReclutamientoService {

  //  baseUrlParametros: any = 'http://138.128.245.244:8447/infosweb/api/v1/core/parametros/';
    baseUrlCatalogosAcadem: any = 'http://138.128.245.244:8448/infosweb/api/v1/rrhh/catalogos/';
    baseUrlEmpleados: any = 'http://138.128.245.244:8449/infosweb/api/v1/rrhh/empleados/';
    baseUrlReclutamiento: any = 'http://138.128.245.244:8452/infosweb/api/v1/rrhh/reclutamiento/';


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

    obtenerNivelAcademicoC(cia: any, cand: any): Observable<any> {
        return this.http.get(this.baseUrlReclutamiento + 'find-nivel-x-candidato/' + cia + '/' + cand);
    }



    //guardar
    guardarPreparacion(
        preparacion: NivelesXCandidato
      ): Observable<NivelesXCandidato> {
        console.log(preparacion);
        return this.http
          .post<NivelesXCandidato>(
            this.baseUrlReclutamiento + "create-nivel-x-candidato",
            preparacion
          )
          .pipe(catchError(this.handleError));
      }


     //eliminacion
     
     eliminarPreparacion(nivelesxcandidatopk: NivelesXCandidatoPK): Observable<any> {
      let tpreparacion: NivelesXCandidato = new NivelesXCandidato();
  
      tpreparacion.nivelesXCandidatoPK = nivelesxcandidatopk;
      console.log("preparacion a eliminar");
      console.log(nivelesxcandidatopk+"--"+nivelesxcandidatopk);
      console.log(tpreparacion);
  
      return this.http
        .delete<any>(this.baseUrlReclutamiento + "delete-nivel-x-candidato", {
          body: tpreparacion,
        })
        .pipe(catchError(this.handleError));
    }


}

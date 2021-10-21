import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { DependientesComponent } from "../expediente-empleado/dependientes/dependientes.component";
import { Capacitaciones } from "../expediente-empleado/modelo/Capacitaciones";
import { capacitacionXEmpPK } from "../expediente-empleado/modelo/CapacitacionPK";
import { dependienteXEmpPK } from "../expediente-empleado/modelo/DependientesPK";
import { Dependientes } from "../expediente-empleado/modelo/Dependietnes";
import { equipoXEmpPK } from "../expediente-empleado/modelo/EquipoPK";
import { Equipos } from "../expediente-empleado/modelo/Equipos";
import { expLaboralEmpleadoPK } from "../expediente-empleado/modelo/ExperenciaPK";
import { Experiencias } from "../expediente-empleado/modelo/Experiencia";

@Injectable({
  providedIn: "root",
})
export class AcademicaService {
  //  baseUrlParametros: any = 'http://138.128.245.244:8447/infosweb/api/v1/core/parametros/';
  baseUrlCatalogosAcadem: any =
    "http://138.128.245.244:8448/infosweb/api/v1/rrhh/catalogos/";
  baseUrlEmpleados: any =
    "http://138.128.245.244:8449/infosweb/api/v1/rrhh/empleados/";

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    console.log("ERROR EN LOS SERVIVIOS" + errorMessage);
    return throwError(errorMessage);
  }

  obtenerNivelAcademico(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-nivel-academico/" + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerPuestos(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-puestos/" + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerOcupaciones(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-ocupaciones/" + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerTiposEquipos(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-tipo-equipos/" + cia)
      .pipe(catchError(this.handleError));
  }


  obtenerCapacitaciones(cia: number, emp: number): Observable<any> {
    return this.http
      .get(
        this.baseUrlEmpleados + "find-capacitaciones-x-emp/" + cia + "/" + emp
      )
      .pipe(catchError(this.handleError));
  }

  guardarCapacitacion(
    capacitacion: Capacitaciones
  ): Observable<Capacitaciones> {
    console.log(capacitacion);
    return this.http
      .post<Capacitaciones>(
        this.baseUrlEmpleados + "create-capacitacion-x-emp",
        capacitacion
      )
      .pipe(catchError(this.handleError));
  }

  eliminarCapacitacion(capacitacionpk: capacitacionXEmpPK): Observable<any> {
    let tcapacitacion: Capacitaciones = new Capacitaciones();

    tcapacitacion.capacitacionXEmpPK = capacitacionpk;
    console.log("capacitacion a eliminar");
    console.log(tcapacitacion);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-capacitacion-x-emp", {
        body: tcapacitacion,
      })
      .pipe(catchError(this.handleError));
  }

  obtenerDependientes(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-dependientes-x-emp/" + cia + "/" + emp)
      .pipe(catchError(this.handleError));
  }

  guardarDependiente(dependiente: Dependientes): Observable<Dependientes> {
    console.log(dependiente);
    return this.http
      .post<Dependientes>(
        this.baseUrlEmpleados + "create-dependiente-x-emp",
        dependiente
      )
      .pipe(catchError(this.handleError));
  }

  eliminarDependiente(DependientesPK: dependienteXEmpPK): Observable<any> {
    let tdependiente: Dependientes = new Dependientes();

    tdependiente.dependienteXEmpPK = DependientesPK;
    console.log("eliminar dependendiente");
    console.log(tdependiente);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-dependiente-x-emp", {
        body: tdependiente,
      })
      .pipe(catchError(this.handleError));
  }

  obtenerExperiencias(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-explaboral-x-emp/" + cia + "/" + emp)
      .pipe(catchError(this.handleError));
  }

  guardarExperiencia(experiencia: Experiencias): Observable<Experiencias> {
    console.log(experiencia);
    return this.http
      .post<Experiencias>(
        this.baseUrlEmpleados + "create-explaboral-x-emp",
        experiencia
      )
      .pipe(catchError(this.handleError));
  }

  eliminarExperiencia(ExperenciaPK: expLaboralEmpleadoPK): Observable<any> {
    let texperiencia: Experiencias = new Experiencias();
    console.log("eliminar llego experiencia");
    console.log(ExperenciaPK);

    texperiencia.expLaboralEmpleadoPK = ExperenciaPK;
    console.log("eliminar experiencia");
    console.log(texperiencia);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-explaboral-x-emp", {
        body: texperiencia,
      })
      .pipe(catchError(this.handleError));
  }

  obtenerEquipos(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-equipo-x-emp-puesto-trabajo/" + cia + "/" + emp)
      .pipe(catchError(this.handleError));
  }


  guardarEquipo(equipo: Equipos): Observable<Equipos> {
    console.log(equipo);
    return this.http
      .post<Equipos>(
        this.baseUrlEmpleados + "create-equipo-x-emp",
        equipo
      )
      .pipe(catchError(this.handleError));
  }

  eliminarEquipo(EquipoPK : equipoXEmpPK): Observable<any> {
    let tequipo: Equipos = new Equipos();
    console.log("eliminar llego equipo");
    console.log(EquipoPK);

    tequipo.equipoXEmpPK = EquipoPK;
    console.log("eliminar equipo");
    console.log(tequipo);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-equipo-x-emp", {
        body: tequipo,
      })
      .pipe(catchError(this.handleError));
  }



  obtenerProfesionAcadem(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-profesion/" + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerPrepAcademica(cia: any, emp: any): Observable<any> {
    return this.http.get(
      this.baseUrlEmpleados + "find-nivel-x-emp/" + cia + "/" + emp
    );
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

import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { DependientesComponent } from "../expediente-empleado/dependientes/dependientes.component";
import { Beneficiarios } from "../expediente-empleado/modelo/Beneficiarios";
import { Capacitaciones } from "../expediente-empleado/modelo/Capacitaciones";
import { capacitacionXEmpPK } from "../expediente-empleado/modelo/CapacitacionPK";
import { dependienteXEmpPK } from "../expediente-empleado/modelo/DependientesPK";
import { Dependientes } from "../expediente-empleado/modelo/Dependietnes";
import { EmergenciaEmp } from "../expediente-empleado/modelo/EmergenciaEmp";
import { Emergencias, emergenciaXEmpPK } from "../expediente-empleado/modelo/Emergencias";
import { equipoXEmpPK } from "../expediente-empleado/modelo/EquipoPK";
import { Equipos } from "../expediente-empleado/modelo/Equipos";
import { expLaboralEmpleadoPK } from "../expediente-empleado/modelo/ExperenciaPK";
import { Experiencias } from "../expediente-empleado/modelo/Experiencia";
import { IdiomasEmp, idiomaXEmpPK } from "../expediente-empleado/modelo/IdiomasEmp";
import { nivelAcademico } from "../expediente-empleado/modelo/NivelAcademico";
import { nivelesXEmpPK } from "../expediente-empleado/modelo/NivelAcademicoPK";
import { PruebasEmp, tipoPruebaXEmpPK } from "../expediente-empleado/modelo/Pruebas";
import { referenciaEmpPK, Referencias } from "../expediente-empleado/modelo/Referencias";

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

  obtenerListadoIdiomas(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-tipo-idiomas/" + cia)
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

  obtenerListadoPruebas(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-tipo-prueba/" + cia)
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


  obtenerReferencias(cia: number, emp: number, tipo : any): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-referencia-x-emp/" + cia + "/" + emp + '/'+tipo)
      .pipe(catchError(this.handleError));
  }

  guardarReferencia(referencia: Referencias): Observable<Referencias> {
    console.log(referencia);
    return this.http
      .post<Referencias>(
        this.baseUrlEmpleados + "create-referencia-x-emp",
        referencia
      )
      .pipe(catchError(this.handleError));
  }

  eliminarReferencia(refenciaPK : referenciaEmpPK): Observable<any> {
    let treferencia: Referencias = new Referencias();
    console.log("eliminar llego referencia");
    console.log(refenciaPK);

    treferencia.referenciaEmpPK  = refenciaPK;
    console.log("eliminar  referencia");
    console.log(treferencia);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-referencia-x-emp", {
        body: treferencia,
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

  guardarPreparacionAcademica(prepracionAcademica: nivelAcademico): Observable<nivelAcademico> {
    console.log(prepracionAcademica);
    return this.http
      .post<nivelAcademico>(
        this.baseUrlEmpleados + "create-nivel-x-emp",
        prepracionAcademica
      )
      .pipe(catchError(this.handleError));
  }

  eliminarPreparacionAcademica(nivelesXEmpPK : nivelesXEmpPK): Observable<any> {
    let tnivelAcademico: nivelAcademico = new nivelAcademico();
    console.log("eliminar llego nivel academico");
    console.log(nivelesXEmpPK);

    tnivelAcademico.nivelesXEmpPK  = nivelesXEmpPK;
    console.log("eliminar  nivel academico");
    console.log(tnivelAcademico);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-nivel-x-emp", {
        body: tnivelAcademico,
      })
      .pipe(catchError(this.handleError));
  }



  obtenerBeneficiarios(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-beneficiario-emp/" + cia + "/" + emp )
      .pipe(catchError(this.handleError));
  }

  guardarBeneficiario(beneficiario: Beneficiarios): Observable<Beneficiarios> {
    console.log(beneficiario);
    return this.http
      .post<Beneficiarios>(
        this.baseUrlEmpleados + "create-beneficiario-emp",
        beneficiario
      )
      .pipe(catchError(this.handleError));
  }

  eliminarBeneficiario(beneficiarioXEmpPK : any ): Observable<any> {
    let tbeneficiario: Beneficiarios = new Beneficiarios();
    console.log("eliminar llego beneficirio");
    console.log(beneficiarioXEmpPK);

    tbeneficiario.beneficiarioXEmpPK  = beneficiarioXEmpPK;
    console.log("eliminar  beneficiario");
    console.log(tbeneficiario);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-beneficiario-emp", {
        body: tbeneficiario,
      })
      .pipe(catchError(this.handleError));
  }


  obtenerParentesco(cia: any): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogosAcadem + "listar-parentesco/" + cia)
      .pipe(catchError(this.handleError));
  }


  obtenerIdiomasEmp(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-idioma-x-emp/" + cia + "/" + emp )
      .pipe(catchError(this.handleError));
  }

 guardarIdiomaEmp (IdiomasEmp: IdiomasEmp ): Observable<IdiomasEmp> {
    console.log(IdiomasEmp);
    return this.http
      .post<IdiomasEmp>(
        this.baseUrlEmpleados + "create-idioma-x-emp",
        IdiomasEmp
      )
      .pipe(catchError(this.handleError));
  }


  eliminarIdiomaEmp(idiomaXEmpPK : idiomaXEmpPK ): Observable<any> {
    let tidiomaEmp: IdiomasEmp = new IdiomasEmp();
    console.log("eliminar llego idioma");
    console.log(idiomaXEmpPK);

    tidiomaEmp.idiomaXEmpPK  = idiomaXEmpPK;
    console.log("eliminar  idioma");
    console.log(tidiomaEmp);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-idioma-x-emp", {
        body: tidiomaEmp,
      })
      .pipe(catchError(this.handleError));
  }


  obtenerPruebasEmp(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-tipo-prueba-emp/" + cia + "/" + emp )
      .pipe(catchError(this.handleError));
  }

  guardarPruebaEmp (pruebaEmp: PruebasEmp ): Observable<PruebasEmp> {
    console.log(pruebaEmp);
    return this.http
      .post<PruebasEmp>(
        this.baseUrlEmpleados + "create-tipo-pruebas-x-emp",
        pruebaEmp
      )
      .pipe(catchError(this.handleError));
  }

  eliminarPruebaEmp(pruebaPK : tipoPruebaXEmpPK): Observable<any> {
    let tpruebaEmp: PruebasEmp = new PruebasEmp();
    console.log("eliminar llego pruebaEmp");
    console.log(pruebaPK);

    tpruebaEmp.tipoPruebaXEmpPK  = pruebaPK;
    console.log("eliminar  pruebaEmp");
    console.log(tpruebaEmp);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-referencia-x-emp", {
        body: tpruebaEmp,
      })
      .pipe(catchError(this.handleError));
  }


  obtenerEmergecias(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-emergencia-x-emp/" + cia + "/" + emp )
      .pipe(catchError(this.handleError));
  }

  guardarEmergencia (Emergencia: Emergencias ): Observable<Emergencias> {
    console.log(Emergencia);
    return this.http
      .post<Emergencias>(
        this.baseUrlEmpleados + "create-emergencia-x-emp",
        Emergencia
      )
      .pipe(catchError(this.handleError));
  }

  eliminarEmergencia(emergenciaPK : emergenciaXEmpPK): Observable<any> {
    let tEmergencia: Emergencias = new Emergencias();
    console.log("eliminar llego emergencia");
    console.log(emergenciaPK);

    tEmergencia.emergenciaXEmpPK  = emergenciaPK;
    console.log("eliminar  tEmergencia");
    console.log(tEmergencia);

    return this.http
      .delete<any>(this.baseUrlEmpleados + "delete-emergencia-x-emp", {
        body: tEmergencia,
      })
      .pipe(catchError(this.handleError));
  }


  obtenerDatosEmergencia(cia: number, emp: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + "find-emp-emergencias/" + cia + "/" + emp )
      .pipe(catchError(this.handleError));
  }

  updateDatosEmergencia(cia: number, emp: number, datosEmergencia: EmergenciaEmp): Observable<EmergenciaEmp> {
    console.log('LLego a servicio a actualizar.')
    console.log(datosEmergencia);

    return this.http.post<any>(this.baseUrlEmpleados + "edit-emp-emergencias/" + cia + "/" + emp
    , datosEmergencia).pipe(catchError(this.handleError));
  }


}

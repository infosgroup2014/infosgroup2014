import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ProgramacionPla } from '../modelo/ProgramacionPla';
import { ProgramacionPlaPK } from '../modelo/ProgramacionPlaPK';
import { retry, catchError } from 'rxjs/operators';
import { Empleado } from '../modelo/Empleado';
import { Candidato } from '../modelo/Candidato';
import { CandidatoPK } from '../modelo/CandidatoPK';
import { Constants } from '../configuracion/Constants';
import { TipoAccion } from '../accion-personal/modelo/TtipoAccion';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {
  leyenda: string;

  logueado: boolean = false;

  tipoAccionSeleccion: TipoAccion;

  baseUrl: any = Constants.API_URL + '8445/infosweb/api/v1/rrhh/planilla/';

  baseUrlCatalogos: any = Constants.API_URL + '8448/infosweb/api/v1/rrhh/catalogos/';

  baseUrlHX: any = Constants.API_URL + '8450/infosweb/api/v1/rrhh/hx/';

  baseUrlParametros: any = Constants.API_URL + '8447/infosweb/api/v1/core/parametros/';

  baseUrlEmpleados: any = Constants.API_URL + '8449/infosweb/api/v1/rrhh/empleados/';

  baseUrlEmpleadosReportes: any = Constants.API_URL + '8449/infosweb/api/v1/rrhh/reportes/';

  baseUrlCandidato: any = Constants.API_URL + '8452/infosweb/api/v1/rrhh/reclutamiento/';

  private objetoPlanillaService: ProgramacionPla;

  private banderaInicio: boolean;

  headers = new HttpParams();

  constructor(private http: HttpClient) { }

  agregarCabeceras() {
    this.headers = new HttpParams().set('Content-Type', 'application/json');
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




  contratar(objeto: any): Observable<any> {
    return this.http.post<Candidato>(this.baseUrlEmpleados + 'contratar-empleado', objeto).pipe(catchError(this.handleError));
  }






  obtenerCandidatoID(candidatoPk: CandidatoPK): Observable<Candidato> {
    return this.http.post<Candidato>(`${this.baseUrlCandidato}obtener-candidato-by-id`, candidatoPk);
  }

  obtenerCandidatos(objetoParam: any): Observable<Candidato[]> {
    let params = new HttpParams();
    params = objetoParam;
    return this.http
      .get<Candidato[]>(this.baseUrlCandidato + 'obtener-candidato-filter', { params: params })
      .pipe(catchError(this.handleError));
  }

  listarCandidadoEstado(cia: number, estado: string): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.baseUrlCandidato + 'listar-candidato' + '/' + cia + '/' + estado);
  }

  editarCandidato(candidato: Candidato): Observable<Candidato> {
    return this.http.put<Candidato>(this.baseUrlCandidato + 'editar-candidato', candidato);
  }

  guardarCandidato(candidato: Candidato): Observable<Candidato> {
    return this.http.post<Candidato>(this.baseUrlCandidato + 'crear-candidato', candidato).pipe(catchError(this.handleError));
  }

  obtenerResumenByPlanilla(
    cia: number,
    codTipoPla: number,
    anio: number,
    mes: number,
    numPla: number,
    suc: number,
    deptop: number
  ): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        'find-resumen-asistencia-by-programacion-pla/' +
        cia +
        '/' +
        anio +
        '/' +
        mes +
        '/' +
        codTipoPla +
        '/' +
        numPla +
        '/' +
        suc +
        '/' +
        deptop
      )
      .pipe(catchError(this.handleError));
  }



  obtenerPatrono(cia: number): Observable<Empleado[]> {
    return this.http
      .get<Empleado[]>(this.baseUrlEmpleados + 'find-representate-patronal/' + cia)
      .pipe(catchError(this.handleError));
  }



  obtenerDepenciaEmpleado(cia: number, codEmp: number): Observable<any> {
    return this.http
      .get<Empleado>(this.baseUrlEmpleados + 'find-emp-dependencia/' + cia + '/' + codEmp)
      .pipe(catchError(this.handleError));
  }

  editarEmpleado(objeto: any): Observable<any> {
    return this.http.post(this.baseUrlEmpleados + 'edit-empleado/', objeto).pipe(catchError(this.handleError));
  }

  impresionReportesExpedientes(objeto: any): Observable<any> {
    return this.http
      .post(this.baseUrlEmpleadosReportes + 'imprimir-reporte-expediente/', objeto)
      .pipe(catchError(this.handleError));
  }

  obtenerFirmas(cia: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleadosReportes + 'find-empleado-firmas/' + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerEmpleado(cia: number, codEmp: number): Observable<any> {
    return this.http
      .get<Empleado>(this.baseUrlEmpleados + 'find-emp-by-id/' + cia + '/' + codEmp)
      .pipe(catchError(this.handleError));
  }




  obtenerIncapacidades(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-incapacidades/' + cia).pipe(catchError(this.handleError));
  }


  obtenerPosiciones(cia: number, status: string): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-posiciones/' + cia + '/' + status).pipe(catchError(this.handleError));
  }

  obtenerSangre(): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-tipo-sangre/').pipe(catchError(this.handleError));
  }

  obtenerOcupaciones(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-ocupaciones/' + cia).pipe(catchError(this.handleError));
  }

  obtenerTipoPuesto(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-tipo-puesto/' + cia).pipe(catchError(this.handleError));
  }

  obtenerMovDp(cia: number, codTipoPla: number, anio: number, mes: number, numPla: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl + 'mov-dp/obtener-mov-dp/' + cia + '/' + codTipoPla + '/' + anio + '/' + mes + '/' + numPla
      )
      .pipe(catchError(this.handleError));
  }

  guardarCargaManualDeduc(objeto: any) {
    return this.http
      .post(this.baseUrl + 'mov-dp/procesar-mov-dp-manual', objeto)
      .pipe(catchError(this.handleError));
  }

  obtenerDeduccion(cia: number, tipo: any): Observable<any> {
    return this.http
      .get(this.baseUrl + 'deduc-presta-by-tipo/' + cia + '/' + tipo)
      .pipe(catchError(this.handleError));
  }

  obtenerEmpleados(objetoParam: any): Observable<any> {
    let params = new HttpParams();
    params = objetoParam;

    return this.http
      .get(this.baseUrlEmpleados + 'find-emp-by-filter', { params: params })
      .pipe(catchError(this.handleError));
  }

  obtenerResumenByProgramacion(cia: number, mes: any, anio: any, tipo: any, num: any): Observable<any> {
    return this.http.get(
      this.baseUrl + 'find-resumen-by-programacion-pla/' + cia + '/' + anio + '/' + mes + '/' + tipo + '/' + num
    );
  }

  cargarMovDP(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'mov-dp/cargar-archivo-mov-dp', objeto).pipe(catchError(this.handleError));
  }

  obtenerEtnia(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-etnias' + '/' + cia).pipe(catchError(this.handleError));
  }

  obtenerMuniDeptoPais(pais: number, deptop: number): Observable<any> {
    console.log('lo que mando:' + pais);
    console.log('lo que mando' + deptop);
    return this.http
      .get(this.baseUrlParametros + 'obtener-municipio-by-pais-depto' + '/' + pais + '/' + deptop)
      .pipe(catchError(this.handleError));
  }

  obtenerDeptoPais(pais: number): Observable<any> {
    return this.http
      .get(this.baseUrlParametros + 'obtener-deptos-by-pais' + '/' + pais)
      .pipe(catchError(this.handleError));
  }

  obtenerHorasExtrasLista(cia: number, anio: number, mes: number, tipo: number, numPla: number): Observable<any> {
    return this.http
      .get(this.baseUrlHX + 'find-hx-list/' + cia + '/' + anio + '/' + mes + '/' + tipo + '/' + numPla)
      .pipe(catchError(this.handleError));
  }

  obtenerIncapacidad(cia: number): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogos + 'listar-tipo-discapacidad/' + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerClasificacionEmpleado(cia: number): Observable<any> {
    return this.http
      .get(this.baseUrlCatalogos + 'listar-clasificacion-empleado/' + cia)
      .pipe(catchError(this.handleError));
  }

  obtenerPlazas(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-plaza/' + cia).pipe(catchError(this.handleError));
  }

  obtenerDeptoByGerencia(cia: number, gerencia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-depto-gerencia/' + cia + '/' + gerencia).pipe(catchError(this.handleError));
  }

  obtenerPuestos(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-puestos/' + cia).pipe(catchError(this.handleError));
  }

  obtenerDepartamento(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-departamentos/' + cia).pipe(catchError(this.handleError));
  }

  obtenerDireccion(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-gerencias/' + cia).pipe(catchError(this.handleError));
  }

  obtenerPlanta(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-agencias/' + cia).pipe(catchError(this.handleError));
  }

  obtenerEstadoCivil(): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-estado-civil/').pipe(catchError(this.handleError));
  }

  obtenerEmpresas(cia: number): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-areas-staff/' + cia).pipe(catchError(this.handleError));
  }

  obtenerResumenAsistenciaNoAplicados(cia: number, anio: number, sec: number, tipo: number): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        'find-resumen-no-aplicado-by-programacion-pla/' +
        cia +
        '/' +
        anio +
        '/' +
        sec +
        '/' +
        tipo
      )
      .pipe(catchError(this.handleError));
  }

  obtenerFechas(cia: number, anio: number, mes: number, quincena: number): Observable<any> {
    return this.http
      .get(this.baseUrl + 'find-fechas-programacion/' + cia + '/' + anio + '/' + mes + '/' + quincena)
      .pipe(catchError(this.handleError));
  }

  obtenerBancos(cia: any): Observable<any> {
    return this.http.get(this.baseUrlCatalogos + 'listar-bancos/' + cia).pipe(catchError(this.handleError));
  }

  obtenerDetalleHorasExtras(cia: any, anio: any, mes: any, tipo: any, numpla: any, orden: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        'find-hx-by-programacion-pla-det/' +
        cia +
        '/' +
        anio +
        '/' +
        mes +
        '/' +
        tipo +
        '/' +
        numpla +
        '/' +
        orden
      )
      .pipe(catchError(this.handleError));
  }

  generarPlanillaSevice(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'generar-planilla', objeto).pipe(catchError(this.handleError));
  }

  cerrarPlanillaSevice(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'cerrar-planilla', objeto).pipe(catchError(this.handleError));
  }

  obtenerTotalesPlanilla(cia: any, anio: any, secuencia: any, tipo: any): Observable<any> {
    return this.http.get(
      'http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/total-planilla-by-programacion/' +
      cia +
      '/' +
      anio +
      '/' +
      secuencia +
      '/' +
      tipo
    );
  }

  obtenerDetalleDeducPresta(cia: any, anio: any, secuencia: any, tipo: any, codDp: any): Observable<any> {
    return this.http.get(
      this.baseUrl +
      'find-detalle-resumen-by-programacion-pla/' +
      cia +
      '/' +
      anio +
      '/' +
      secuencia +
      '/' +
      tipo +
      '/' +
      codDp
    );
  }

  obtenerHorasXtras(cia: any, anio: any, secuencia: any, tipo: any, numPla: any): Observable<any> {
    return this.http.get(
      'http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/find-hx-by-programacion-pla-enc/' +
      cia +
      '/' +
      anio +
      '/' +
      secuencia +
      '/' +
      tipo +
      '/' +
      numPla
    );
  }

  guardarPlanilla(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'crear-programacion-pla', objeto);
  }

  EditarPlanilla(objeto: any): Observable<any> {
    return this.http.put(this.baseUrl + 'editar-programacion-pla', objeto);
  }

  obtenerTiposPlanilla(cia: any, rol: any): Observable<any> {
    return this.http.get(
      'http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/tipos-pla-by-rol/' + cia + '/' + rol
    );
  }

  obtenerPlanillas(mes: any, anio: any): Observable<any> {
    return this.http.get(
      'http://138.128.245.244:8445/infosweb/api/v1/rrhh/planilla/programacion-by-anio-mes/3/' + anio + '/' + mes
    );
  }

  obtenerResumen(mes: any, anio: any, tipo: any, num: any, tipoDeduccion: any): Observable<any> {
    return this.http.get(
      this.baseUrl +
      'find-resumen-by-programacion-pla-suma-resta/' +
      '3/' +
      anio +
      '/' +
      mes +
      '/' +
      tipo +
      '/' +
      num +
      '/' +
      tipoDeduccion
    );
  }

  obtenerAccionEnc(cia: any, anio: any, mes: any, tipo: any, num: any): Observable<any> {
    return this.http.get(
      this.baseUrl +
      'find-acciones-enc-by-programacion-pla/' +
      cia +
      '/' +
      anio +
      '/' +
      mes +
      '/' +
      tipo +
      '/' +
      num +
      '/'
    );
  }

  obtenerAccionDetalle(cia: any, anio: any, mes: any, tipo: any, num: any, tipoAccion: any): Observable<any> {
    return this.http.get(
      this.baseUrl +
      'find-acciones-det-by-programacion-pla/' +
      cia +
      '/' +
      anio +
      '/' +
      mes +
      '/' +
      tipo +
      '/' +
      num +
      '/' +
      tipoAccion
    );
  }

  obtenerProgramacionCloser(cia: any, tipo: any): Observable<any> {
    return this.http.get(this.baseUrl + 'programapla-by-tipo/' + cia + '/' + tipo);
  }

  cargarHX(objeto: any): Observable<any> {
    return this.http.post(this.baseUrlHX + 'cargar-archivo-hx', objeto);
  }

  obtenerPaises(): Observable<any> {
    return this.http.get(this.baseUrlParametros + 'obtener-paises').pipe(catchError(this.handleError));
  }

  generarReporteDeduccionesNoAplicadas(cia: any, anio: any, secuencia: any, tipo: any): Observable<any> {
    return this.http
      .get(
        this.baseUrl +
        'reportes/generar-reporte-deduc-no-aplicada/' +
        cia +
        '/' +
        anio +
        '/' +
        secuencia +
        '/' +
        tipo
      )
      .pipe(catchError(this.handleError));
  }


  generarArchivoAFP(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'reportes/generar-archivo-afp', objeto).pipe(catchError(this.handleError));
  }

  generarArchivoISSS(objeto: any): Observable<any> {
    return this.http.post(this.baseUrl + 'reportes/generar-archivo-isss', objeto).pipe(catchError(this.handleError));
  }

  generarReporteDeducciones(cia: any, anio: any, secuencia: any, tipo: any): Observable<any> {
    return this.http
      .get(this.baseUrl + 'reportes/generar-reporte-deduc/' + cia + '/' + anio + '/' + secuencia + '/' + tipo)
      .pipe(catchError(this.handleError));
  }



  obtenerEmpleadosInactivos(objetoParam: any): Observable<any> {
    let params = new HttpParams();
    params = objetoParam;

    return this.http
      .get(this.baseUrlEmpleados + 'find-emp-inactivos-by-filter', { params: params })
      .pipe(catchError(this.handleError));
  }



  obtenerEmpleadosAfectadosDepto(cia: any, depto: any): Observable<any> {


    return this.http
      .get(this.baseUrlEmpleados + 'total-emp-afectado-depto-filter/' + cia + '/' + depto)
      .pipe(catchError(this.handleError));
  }

  obtenerEmpleadosByDepto(cia: any, depto: any): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + 'obtener-empleado-by-depto/' + cia + '/' + depto)
      .pipe(catchError(this.handleError));
  }


  obtenerEmpleadosByRango(cia: any, si: number, sf: number): Observable<any> {
    return this.http
      .get(this.baseUrlEmpleados + 'obtener-empleado-by-rango-salario/' + cia + '/' + si + '/' + sf)
      .pipe(catchError(this.handleError));
  }


  public get objetoPlanillaServicio() {
    return this.objetoPlanillaService;
  }

  public set objetoPlanillaServicio(val) {
    this.objetoPlanillaService = val;
  }

  public get getBanderaInicio() {
    return this.banderaInicio;
  }

  public set setBanderaInicio(valores) {
    this.banderaInicio = valores;
  }




}

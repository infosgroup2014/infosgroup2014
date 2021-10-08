import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, AbstractControl, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { CustomValidators } from "../../../shared/custom.validator";
import { BuscarCandidatoModel } from "../../modelo/BuscarCandidato";
import { Empleado } from "../../modelo/Empleado";
import { FormEmpleadoModel } from "../../modelo/formEmpleadoModel";
import { Ocupaciones } from "../../modelo/Ocupaciones";
import { OcupacionesPK } from "../../modelo/OcupacionesPK";
import { RequestParamReporteEmp } from "../../modelo/RequestParamReporteEmp";
import { PlanillaService } from "../../servicio/planilla.service";
import { ReportesService } from "../../servicio/reportes.service";
import { Candidato } from "./modelo/Candidato";
import { CandidatoPK } from "./modelo/CandidatoPK";
import { CustomDateParserFormatter } from "./modelo/FormatFecha";

@Component({
  selector: 'carga-manual',
  templateUrl: './candidato-form.component.html',
  styleUrls: ['./candidato-form.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class CandidatoComponent implements OnInit {

  validationMessages = {
    'nombres' : {
      'required' : 'Ingrese el nombre, por favor.'
    },
    'apellidos' : {
      'required' : 'Ingrese el nombre, por favor.'
    },
    'estadoCivil' : {
      'required' : 'Ingrese el nombre, por favor.'
    },
    'igss': {
      'maxlength': 'igss sobrepasa los 12 caracteres',
    },
    'email': {
      'validoCorreo': 'el formato no corresponde a un correo, verifique por favor.'
    },
  };

  formErrors = {
    'nombres':'',
    'apellidos' :'',
    'estadoCivil' : '',
    'igss': '',
    'email': ''
  };

  mostrarAnioReporte: boolean = false;
  cargoFoto: boolean = false;
  candidatoSeleccionado: Candidato = new Candidato();

  fechaExpedicionDoc: NgbDateStruct;
  fechaSolicitud: NgbDateStruct;
  fechaLabores: NgbDateStruct;
  fechaPlanilla: NgbDateStruct;
  fechaFinLabo: NgbDateStruct;
  fechaNacimiento: NgbDateStruct;
  sexoEmpleado: any;
  listaSexo = [
    { label: 'Masculino', valor: '1' },
    { label: 'Femenino', valor: '2' }
  ];
  listarEmpresas: Array<any>;
  empForm: FormGroup;
  listadoEstadoCivil: Array<any>;
  listadoPlantas: Array<any>;
  listadoDireccion: Array<any>;
  listadoDepartamento: Array<any>;
  listadoPuestos: Array<any>;
  listadoPlaza: Array<any>;
  listaClasificacionEmp: Array<any>;
  listadoIncapacidad: Array<any>;
  listaControlEntrada = [
    { label: 'Si', valor: 'S' },
    { label: 'No', valor: 'N' }
  ];
  listadoPaises: Array<any>;
  listadoDepartamentos: Array<any>;
  listaMunicipio: Array<any>;
  listarEtnia: Array<any>;
  listaCategoriaSeguro = [{ valor: 'A' }, { valor: 'B' }];
  listaTipoPuesto: Array<any>;
  listadoTipoPlanilla: Array<any>;
  listaPensionado = [
    { label: 'SI', valor: 'S' },
    { label: 'NO', valor: 'N' }
  ];
  codPaisGral: number;
  listaMunicipioNac: Array<any>;
  listadoDepartamentosNac: Array<any>;
  codPaisNac: number;
  listaOcupacionEmpleado: Array<any>;
  listaPagoDolares = [
    { label: 'Si', valor: '1' },
    { label: 'No', valor: '0' },
    { label: 'Seleccione', valor: '-1' }
  ];
  listaPaisesNacionalidad: Array<any>;
  listaDepartamentosNacionalidad: Array<any>;
  codPaisNacionalidad: number;
  listaMunicipioNacionalidad: Array<any>;
  listaBancos: Array<any>;
  listaComputacion = [
    { label: 'Si', valor: 'S' },
    { label: 'No', valor: 'N' }
  ];
  listaJubilado = [
    { label: 'Seleccione', valor: '-1' },
    { label: 'Si', valor: 'S' },
    { label: 'No', valor: 'N' }
  ];
  listaFormaPago = [
    { label: 'Cheque', valor: 'C' },
    { label: 'Deposito', valor: 'D' },
    { label: 'Efectivo', valor: 'E' }
  ];
  p: number = 1;
  formEmpleado: FormGroup;
  formCandidato: FormGroup;
  listaEmpleados: Array<any>;
  public empleadoSelecionado = new Empleado();
  listaFirmas: Array<any>;
  listaFormato = [
    { label: 'PDF', valor: 1 },
    { label: 'RTF', valor: 2 }
  ];
  listaTipoReportes: Array<any>;
  public _MODULO_PORTAL = 'RRHH_PORTAL';
  listaCandidatos: Candidato[] = [];

  formReporteExp: FormGroup;
  requestReporteExpediente: RequestParamReporteEmp = new RequestParamReporteEmp();
  urlFoto: any;
  codigoEmpleado: number;


  constructor(
    private router: Router,
    private servicioPlanilla: PlanillaService,
    private fb: FormBuilder,
    private _reporteService: ReportesService,
    private calendar: NgbCalendar,
    private domSanitizer: DomSanitizer
  ) {
    this.obtenerEmpresas(1);
    this.crearFormularioEmpleado();
    this.createForm();
    this.crearFormularioReporteExp();
    this.servicioPlanilla.logueado = true;
  }


  ngOnInit(): void {


    this.servicioPlanilla.obtenerFirmas(3).subscribe(
      (firmas) => {
        this.listaFirmas = firmas;
      },
      (error) => {
        console.log('Errores:' + error);
      }
    );

    this._reporteService.obtenerTiposReportes(3, this._MODULO_PORTAL, 2).subscribe(
      (formato) => {
        this.listaTipoReportes = formato;
      },
      (error) => {
        console.log('ERROR CAPTURADO API FORMATOS TIPOS' + JSON.stringify(error));
      }
    );

    this.empForm.valueChanges.subscribe(
      (data) => {
           this.logValidationErrors(this.empForm);
      }
    );
  }

  public crearFormularioReporteExp(): void {
    this.formReporteExp = this.fb.group({
      tipoReporte: [''],
      formatoReporte: [''],
      firma: [''],
      anio: ['']
    });
  }

  crearFormularioEmpleado() {
    this.empForm = this.fb.group({
      apCasada: [''],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      empresa: [''],
      estadoCivil: ['', [Validators.required]],
      planta: [''],
      direccion: [''],
      departamento: [''],
      puesto: [''],
      plaza: [''],
      clasificacion: [''],
      incapacidad: [''],
      salario: [''],
      bonificacion: [''],
      ingreso: [''],
      controlEntrada: [''],
      estadoEmp: [''],
      paisDomicilio: [''],
      deptoDomicilio: [''],
      muniDomicilio: [''],
      telefonoEmp: [''],
      celularEmp: [''],
      etnia: [''],
      direccionGral: [''],
      paisNacimimiento: [''],
      deptoNacimimiento: ['', 0],
      muniNacimimiento: [''],
      valorSeguro: [''],
      tipoPuesto: [''],
      planilla: [''],
      pensionado: [''],
      madreNombre: [''],
      madreOcupacion: [''],
      madreTrabajo: [''],
      padreNombre: [''],
      ocupacionPadre: [''],
      trabajoPadre: [''],
      ocupacionEmpleado: [''],
      pagoDolares: [''],
      paisNacionadlidad: [''],
      departamentoNacionalidad: [''],
      muniNacional: [''],
      documentoIdentidad: [''],
      direccionDoc: [''],
      tieneFamiliares: [''],
      passaporte: [''],
      IGSS: ['',Validators.maxLength(10) ],
      IGSSNombre: [''],
      ITRA: [''],
      NIT: [''],
      NITNombre: [''],
      banco: [''],
      noCuenta: [''],
      nombreCta: [''],
      licencia: [''],
      transporteTrabajar: [''],
      destrezasTecnicas: [''],
      tipoVehiculoManeja: [''],
      computacion: [''],
      jubilado: [''],
      ocupaciones: [''],
      formaPago: [''],
      direccionDui: [''],
      email: ['', CustomValidators.validoCorreo('@')],
      sexo: [''],
    });
  }

   createForm() {
    this.formEmpleado = this.fb.group({
      codEmp: [''],
      nombre: [''],
      numDui: ['']
    });

    this.formCandidato = this.fb.group({
      apellido: [''],
      cia: [''],
      f1: [''],
      f2: [''],
      nombre: [''],
    });

  }

  obtenerEmpresas(cia: number) {

    this.candidatoSeleccionado = null;
    const objeto = {
      empresa: 3
    };

    const objetoCandi = {
      cia: 3
    };

    this.servicioPlanilla.obtenerEmpleados(objeto).subscribe((data) => {
      this.listaEmpleados = data;
      //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
    });


    this.servicioPlanilla.obtenerCandidatos(objetoCandi).subscribe((data: Candidato[]) => {
      this.listaCandidatos = data;
    })

    this.servicioPlanilla.obtenerEmpresas(cia).subscribe((empresa) => {
      this.listarEmpresas = empresa;
    });

    this.servicioPlanilla.obtenerEstadoCivil().subscribe((estadoCivil) => {
      this.listadoEstadoCivil = estadoCivil;
    });

    this.servicioPlanilla.obtenerPlanta(3).subscribe((planta) => {
      this.listadoPlantas = planta;
    });

    this.servicioPlanilla.obtenerDireccion(3).subscribe((direccion) => {
      this.listadoDireccion = direccion;
    });

    this.servicioPlanilla.obtenerDepartamento(3).subscribe((data) => (this.listadoDepartamento = data));
    this.servicioPlanilla.obtenerPuestos(3).subscribe((puesto) => (this.listadoPuestos = puesto));
    this.servicioPlanilla.obtenerPlazas(3).subscribe((plazas) => (this.listadoPlaza = plazas));
    this.servicioPlanilla.obtenerClasificacionEmpleado(3).subscribe((clas) => (this.listaClasificacionEmp = clas));
    this.servicioPlanilla.obtenerIncapacidad(3).subscribe((inca) => (this.listadoIncapacidad = inca));
    this.servicioPlanilla.obtenerPaises().subscribe((pais) => {
      this.listadoPaises = pais;
      this.listaPaisesNacionalidad = pais;
    });

    this.servicioPlanilla.obtenerEtnia(3).subscribe((etnia) => {
      this.listarEtnia = etnia;
    });
    this.servicioPlanilla.obtenerTipoPuesto(3).subscribe((tipoP) => (this.listaTipoPuesto = tipoP));
    this.servicioPlanilla.obtenerTiposPlanilla(3, 2).subscribe((pla) => (this.listadoTipoPlanilla = pla));
    this.servicioPlanilla.obtenerOcupaciones(3).subscribe((ocupacion) => (this.listaOcupacionEmpleado = ocupacion));
    this.servicioPlanilla.obtenerBancos(3).subscribe((banco) => (this.listaBancos = banco));
  }



  obtenerDepto(data: any) {
    this.codPaisGral = data.codPais;
    if (data.codPais) {

      this.servicioPlanilla.obtenerDeptoPais(data.codPais).subscribe((depto) => (this.listadoDepartamentos = depto));

    }


  }

  obtenerDeptoNac(data: any) {
    console.log('Me ejecuto?' + JSON.stringify(data));
    if (data.codPais) {
      this.codPaisNac = data.codPais;
      this.servicioPlanilla
        .obtenerDeptoPais(data.codPais)
        .subscribe((depto) => (this.listadoDepartamentosNac = depto));
    }

  }

  obtenerDeptoNacionalidad(data: any) {
    this.codPaisNacionalidad = data;

    if (data.codPais) {
      this.servicioPlanilla
        .obtenerDeptoPais(data.codPais)
        .subscribe((depto) => (this.listaDepartamentosNacionalidad = depto));
    }

  }

  obtenerMunicicipio(data: any) {
    let pais = this.codPaisGral;
    this.servicioPlanilla
      .obtenerMuniDeptoPais(pais, data)
      .subscribe((depto) => (this.listaMunicipio = depto));
  }

  obtenerMunicicipioNac(data: any) {
    let pais = this.codPaisNac;

    console.log('llenado municipios' + pais + ',deptop:' + JSON.stringify(data));

    this.servicioPlanilla.obtenerMuniDeptoPais(pais, data).subscribe((depto) => (this.listaMunicipioNac = depto));
  }

  obtenerMunicicipioNacionalidad(data: any) {
    let pais: any = this.codPaisNacionalidad;
    console.log('MANDAR DEPTO PANAMA:' + JSON.stringify(pais));
    this.servicioPlanilla
      .obtenerMuniDeptoPais(
        pais.codPais,
        data
      )
      .subscribe((depto) => (this.listaMunicipioNacionalidad = depto));

  }

  irPreparacionAcademica() {
    this.router.navigate(['preparacion-academica']);
  }
  irCapacitaciones() {
    this.router.navigate(['capacitaciones']);
  }
  irEmergencias() {
    this.router.navigate(['emergencias']);
  }
  irDatosEconomicos() {
    this.router.navigate(['datos-economicos']);
  }
  irDocumentos() {
    this.router.navigate(['documentos']);
  }
  irEquipoOficina() {
    this.router.navigate(['equipo-oficina']);
  }
  irEquipoTrabajo() {
    this.router.navigate(['equipo-trabajo']);
  }
  irIdiomas() {
    this.router.navigate(['idiomas']);
  }
  irMotivaciones() {
    this.router.navigate(['motivaciones']);
  }
  irObservaciones() {
    this.router.navigate(['observaciones']);
  }

  irDependientes() {
    this.router.navigate(['dependientes']);
  }

  irBeneficiario() {
    this.router.navigate(['beneficiario']);
  }

  irDatosAfiliacion() {
    this.router.navigate(['datos-afiliacion']);
  }

  irExpedienteDigital() {
    this.router.navigate(['expediente-digital']);
  }

  irExperienciaLaboral() {
    this.router.navigate(['experiencia-laboral']);
  }

  irGenerales() {
    this.router.navigate(['generales']);
  }

  irPruebas() {
    this.router.navigate(['pruebas']);
  }

  irPuestosEntrevistas() {
    this.router.navigate(['puestos-entrevistas']);
  }

  irReferencias() {
    this.router.navigate(['referencias']);
  }

  Buscar() {
    this.p = 1;
    let formCandidato = new BuscarCandidatoModel();

    formCandidato.cia = 3;

    if (this.formCandidato.get('apellido').value) {
      formCandidato.apellido = this.formCandidato.get('apellido').value;
    }

    if (this.formCandidato.get('nombre').value) {
      formCandidato.nombre = String(this.formCandidato.get('nombre').value);
    }

    this.listaCandidatos = [];

    this.servicioPlanilla.obtenerCandidatos(formCandidato).subscribe((data: Candidato[]) => {
      this.listaCandidatos = data;
    });

    // this.listaEmpleados = [];

    // this.servicioPlanilla.obtenerEmpleados(formEmpleado).subscribe
    //  ((data) => {
    //   this.listaEmpleados = data;
    // });
  }

  limpiar() {
    this.empForm.reset();
    this.formEmpleado.reset();
    const objeto = {
      cia: 3
    };

    this.listaCandidatos = [];
    this.urlFoto = '';

    this.servicioPlanilla.obtenerCandidatos(objeto).subscribe((data: Candidato[]) => {
      this.listaCandidatos = data;
    });
  }

  obtenerCandidato(candidato: CandidatoPK) {
    this.servicioPlanilla.obtenerCandidatoID(candidato).subscribe((data) => {
      console.log('################################');
      console.log('------>EL CANDIDATO ASIG' + JSON.stringify(data));
      console.log('-------------------------------------------');
      this.asignarCandidato(data);
    });
  }

  asignarCandidato(emp: Candidato) {
    this.candidatoSeleccionado = emp;
    console.log('Candidato ASIGNAR:' + JSON.stringify(this.candidatoSeleccionado));

    if(emp.archivoFoto){
      this.visualizarBase64URL(emp.archivoFoto);
    }

    this.empForm.get('nombres').setValue(this.candidatoSeleccionado.nombre);
    this.empForm.get('apellidos').setValue(this.candidatoSeleccionado.apellido);
    this.empForm.get('apCasada').setValue(this.candidatoSeleccionado.apCasada);
    this.empForm.get('estadoCivil').setValue(this.candidatoSeleccionado.estadoCivil);
    this.empForm.get('email').setValue(this.candidatoSeleccionado.email);
    this.empForm.get('incapacidad').setValue(this.candidatoSeleccionado.discapacidad);
    this.empForm.get('ocupaciones').setValue(this.candidatoSeleccionado.codOcupacion);
    this.empForm.get('sexo').setValue(1);



    if (this.candidatoSeleccionado.fecSolicitud) {
      let ArrayFechaNacSol = this.candidatoSeleccionado.fecSolicitud.split('/');
      this.fechaSolicitud = this.calendar.getToday();
      this.fechaSolicitud.day = Number(ArrayFechaNacSol[0]);
      this.fechaSolicitud.month = Number(ArrayFechaNacSol[1]);
      this.fechaSolicitud.year = Number(ArrayFechaNacSol[2]);

    }

    this.empForm.get('documentoIdentidad').setValue(this.candidatoSeleccionado.numDui);

    this.empForm.get('paisDomicilio').setValue(this.candidatoSeleccionado.codPaisDomic);

    this.empForm.get('deptoDomicilio').setValue(this.candidatoSeleccionado.codDepartamentoDomic);

    this.servicioPlanilla.obtenerMuniDeptoPais(this.candidatoSeleccionado.codPaisDomic, this.candidatoSeleccionado.codDepartamentoDomic).subscribe((depto) => (this.listaMunicipio = depto));
    this.empForm.get('muniDomicilio').setValue(this.candidatoSeleccionado.codMunicipioDomic);

    this.servicioPlanilla.obtenerDeptoPais(this.candidatoSeleccionado.codPaisDomic).subscribe((depto) => (this.listadoDepartamentos = depto));
    this.empForm.get('telefonoEmp').setValue(this.candidatoSeleccionado.telefono);
    this.empForm.get('celularEmp').setValue(this.candidatoSeleccionado.celular);
    this.empForm.get('etnia').setValue(this.candidatoSeleccionado.etnia);
    this.empForm.get('direccionGral').setValue(this.candidatoSeleccionado.direccion);
    console.log('TRAYENDO DATOS ...' + this.candidatoSeleccionado.codPaisNacimiento);

    this.empForm.get('paisNacimimiento').setValue(this.candidatoSeleccionado.codPaisNacimiento);

    this.empForm.get('madreNombre').setValue(this.candidatoSeleccionado.nombreMadre);
    this.empForm.get('padreNombre').setValue(this.candidatoSeleccionado.nombrePadre);

    this.empForm.get('paisNacionadlidad').setValue(this.candidatoSeleccionado.codPaisNacionalidad);

    this.codPaisNacionalidad = this.candidatoSeleccionado.codPaisNacionalidad;




    this.servicioPlanilla.obtenerDeptoPais(this.candidatoSeleccionado.codPaisNacionalidad).subscribe((depto) => (this.listaDepartamentosNacionalidad = depto));

    this.servicioPlanilla.obtenerMuniDeptoPais(this.candidatoSeleccionado.codPaisNacionalidad, Number(this.candidatoSeleccionado.expedicionDui)).subscribe((depto) => (this.listaMunicipioNacionalidad = depto));



    this.empForm.get('departamentoNacionalidad').setValue(Number(this.candidatoSeleccionado.expedicionDui));



    this.empForm.get('muniNacional').setValue(Number(this.candidatoSeleccionado.muniExpDui));

    this.empForm.get('passaporte').setValue(this.candidatoSeleccionado.numPasaporte);





    this.servicioPlanilla.obtenerDeptoPais(this.candidatoSeleccionado.codPaisNacimiento).subscribe((depto) => {
      this.listadoDepartamentosNac = depto;
      this.empForm.get('deptoNacimimiento').setValue(this.candidatoSeleccionado.codDepartamentoNacim);
    });

    this.listaMunicipioNac = [];

    this.servicioPlanilla
      .obtenerMuniDeptoPais(
        this.candidatoSeleccionado.codPaisNacimiento,
        this.candidatoSeleccionado.codDepartamentoNacim
      )
      .subscribe((depto) => (this.listaMunicipioNac = depto));

    this.empForm.get('muniNacimimiento').setValue(this.candidatoSeleccionado.codMunicipioNacim);

    if (this.candidatoSeleccionado.fechaNac) {
      let ArrayFechaNac = this.candidatoSeleccionado.fechaNac.split('/');
      this.fechaNacimiento = this.calendar.getToday();
      this.fechaNacimiento.day = Number(ArrayFechaNac[0]);
      this.fechaNacimiento.month = Number(ArrayFechaNac[1]);
      this.fechaNacimiento.year = Number(ArrayFechaNac[2]);
      console.log('fecha nacimiento' + JSON.stringify(ArrayFechaNac));
    }

    if (this.candidatoSeleccionado.fechaExpDui) {
      let ArrayFechaNacionalSol = this.candidatoSeleccionado.fechaExpDui.split('/');
      this.fechaExpedicionDoc = this.calendar.getToday();
      this.fechaExpedicionDoc.day = Number(ArrayFechaNacionalSol[0]);
      this.fechaExpedicionDoc.month = Number(ArrayFechaNacionalSol[1]);
      this.fechaExpedicionDoc.year = Number(ArrayFechaNacionalSol[2]);

    }

    this.empForm.get('direccionDui').setValue(this.candidatoSeleccionado.conocidoEmpresa);


    this.empForm.get('IGSS').setValue(this.candidatoSeleccionado.numIsss);
    this.empForm.get('IGSSNombre').setValue(this.candidatoSeleccionado.nomIsss);
    this.empForm.get('ITRA').setValue(this.candidatoSeleccionado.numNup);
    this.empForm.get('ITRA').setValue(this.candidatoSeleccionado.numNup);
    this.empForm.get('NIT').setValue(this.candidatoSeleccionado.numNit);
    this.empForm.get('NITNombre').setValue(this.candidatoSeleccionado.nomNit);
    this.empForm.get('passaporte').setValue(this.candidatoSeleccionado.numPasaporte);
    this.empForm.get('licencia').setValue(this.candidatoSeleccionado.numLicencia);
    this.empForm.get('transporteTrabajar').setValue(this.candidatoSeleccionado.transporteUSA);
    this.empForm.get('destrezasTecnicas').setValue(this.candidatoSeleccionado.habilidadesEspeciales);
    this.empForm.get('tipoVehiculoManeja').setValue(this.candidatoSeleccionado.tipoVehiculo);
    this.empForm.get('computacion').setValue(this.candidatoSeleccionado.computacion);



  }

  public impresionReportes(): void {
    let tipo: number;

    if (this.formReporteExp.get('formatoReporte').value) {
      tipo = Number(this.formReporteExp.get('formatoReporte').value);
      this.requestReporteExpediente.tipo = tipo;
    }

    if (this.formReporteExp.get('anio').value) {
      this.requestReporteExpediente.anioReporte = this.formReporteExp.get('anio').value;
    }

    this.requestReporteExpediente.empleado = this.empleadoSelecionado;

    if (this.formReporteExp.get('firma').value) {
      this.requestReporteExpediente.firmas = this.formReporteExp.get('firma').value;
    }

    if (this.formReporteExp.get('tipoReporte').value) {
      this.requestReporteExpediente.formato = this.formReporteExp.get('tipoReporte').value;
    }

    this.servicioPlanilla.impresionReportesExpedientes(this.requestReporteExpediente).subscribe((reporte) => {
      console.log('<---------Genera reporte expendiente------->' + JSON.stringify(reporte));
      if (reporte.archivo) {
        //window.open('data:content-type;base64,' +reporte.archivo);
        this.abrirArchivo(reporte.archivo, tipo);
      }
    });
  }

  public obtenerFormato(valor: any): void {
    console.log('LO QUE VIENE DEL TIPO FORMATO' + JSON.stringify(valor));

    if (valor.nombreReporte == 'FINIQUITO') {
      this.mostrarAnioReporte = true;
    } else {
      this.mostrarAnioReporte = false;
    }

    this.requestReporteExpediente.archivo = valor.archivo;
  }

  public abrirArchivo(dataBase64: any, tipo: number) {
    const data = dataBase64;
    let nombreFile: string;
    if (tipo == 1) {
      nombreFile = 'reporte.pdf';
    } else {
      nombreFile = 'reporte.rtf';
    }
    const fileName = nombreFile;
    const byteCharacters = atob(data);

    let byteNumbers = new Array(byteCharacters.length);

    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    let tipoContenido: string;
    if (tipo == 1) {
      tipoContenido = 'application/pdf';
    } else {
      tipoContenido = 'text/rtf';
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  public mostrarAnio(data: any): void {
    console.log('tipo formato' + JSON.stringify(data));
  }

  visualizarBase64URL(dataArchivo: any) {
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const contentType = 'image/png';
    let b64Data = String(dataArchivo).replace('data:image/png;base64,', '');
    ////console.log('La data que llega al visor de pdf:' + b64Data);

    const blob = b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    //  window.open(blobUrl);
    this.urlFoto = '';
    this.urlFoto = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  }

  public cambiarFotoEmpleado(event) {
    this.cargoFoto = true;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      let archivo: any = reader.result;

      if (!this.candidatoSeleccionado) {
        this.candidatoSeleccionado = new Candidato();
      }

      this.candidatoSeleccionado.archivoFoto = archivo;
      this.visualizarBase64URL(archivo);
    };
  }

  public editarEmpleado(): void {
    let empleadoCreacion = new Empleado();

    if (this.cargoFoto) {
      empleadoCreacion.archivoFoto = this.empleadoSelecionado.archivoFoto;
    }
    empleadoCreacion.empleadosPK = this.empleadoSelecionado.empleadosPK;
    empleadoCreacion.nombres = this.empForm.get('nombres').value;
    empleadoCreacion.apellidos = this.empForm.get('apellidos').value;
    empleadoCreacion.apCasada = this.empForm.get('apCasada').value;
    if (this.fechaSolicitud) {
      empleadoCreacion.fecIngreso = String(
        this.fechaSolicitud.day + '/' + this.fechaSolicitud.month + '/' + this.fechaSolicitud.year
      );
    }
    empleadoCreacion.sexo = Number(this.sexoEmpleado);
    empleadoCreacion.estadoCivil = this.empForm.get('estadoCivil').value;

    if (this.empForm.get('empresa').value) {
      empleadoCreacion.codArea = Number(this.empForm.get('empresa').value);
    }

    if (this.empForm.get('planta').value) {
      empleadoCreacion.codSucursal = Number(this.empForm.get('planta').value);
    }

    if (this.empForm.get('direccion').value) {
      empleadoCreacion.codGerencia = this.empForm.get('direccion').value;
    }

    if (this.empForm.get('departamento').value) {
      empleadoCreacion.codDepto = this.empForm.get('departamento').value;
    }

    if (this.empForm.get('puesto').value) {
      empleadoCreacion.codPuesto = this.empForm.get('puesto').value;
    }

    if (this.empForm.get('plaza').value) {
      empleadoCreacion.codJurisdiccion = this.empForm.get('plaza').value;
    }

    if (this.empForm.get('clasificacion').value) {
      empleadoCreacion.codClasificacion = this.empForm.get('clasificacion').value;
    }

    if (this.empForm.get('planilla').value) {
      empleadoCreacion.codTipoPla = this.empForm.get('planilla').value;
    }

    if (this.empForm.get('formaPago').value) {
      empleadoCreacion.chequeDep = this.empForm.get('formaPago').value;
    }

    if (this.empForm.get('jubilado').value) {
      empleadoCreacion.deConfianza = Number(this.empForm.get('jubilado').value);
    }

    if (this.empForm.get('pensionado').value) {
      empleadoCreacion.pesionado = String(this.empForm.get('pensionado').value);
    }

    if (this.empForm.get('incapacidad').value) {
      empleadoCreacion.discapacidad = String(this.empForm.get('incapacidad').value);
    }

    if (this.empForm.get('ocupaciones').value) {
      empleadoCreacion.ocupaciones = new Ocupaciones();
      empleadoCreacion.ocupaciones.ocupacionesPK = new OcupacionesPK();

      empleadoCreacion.ocupaciones.ocupacionesPK.codCia = 3;
      empleadoCreacion.ocupaciones.ocupacionesPK.codOcupacion = this.empForm.get('ocupaciones').value;
    }

    if (this.fechaLabores) {
      empleadoCreacion.fecIngreso = String(
        this.fechaLabores.day + '/' + this.fechaLabores.month + '/' + this.fechaLabores.year
      );
    }

    if (this.fechaPlanilla) {
      empleadoCreacion.fechaRealPlanilla = String(
        this.fechaPlanilla.day + '/' + this.fechaPlanilla.month + '/' + this.fechaPlanilla.year
      );
    }

    if (this.fechaFinLabo) {
      empleadoCreacion.fecSalida = String(
        this.fechaFinLabo.day + '/' + this.fechaFinLabo.month + '/' + this.fechaFinLabo.year
      );
    }

    if (this.empForm.get('pagoDolares').value) {
      empleadoCreacion.aportacionPolitica = Number(this.empForm.get('pagoDolares').value);
    }

    if (this.empForm.get('salario').value) {
      empleadoCreacion.salarioBase = Number(this.empForm.get('salario').value);
    }

    if (this.empForm.get('bonificacion').value) {
      empleadoCreacion.bonificacion = Number(this.empForm.get('bonificacion').value);
    }

    if (this.empForm.get('controlEntrada').value) {
      empleadoCreacion.controlEntrada = this.empForm.get('controlEntrada').value;
    }

    if (this.empForm.get('estadoEmp').value) {
      empleadoCreacion.status = this.empForm.get('estadoEmp').value;
    }


    empleadoCreacion.codPais = this.empForm.get('paisDomicilio').value;

    empleadoCreacion.codDepar = this.empForm.get('deptoDomicilio').value;

    empleadoCreacion.codMuni = this.empForm.get('muniDomicilio').value;
    if (this.empForm.get('telefonoEmp').value) {
      empleadoCreacion.telefonos = this.empForm.get('telefonoEmp').value;
    }

    if (this.empForm.get('celularEmp').value) {
      empleadoCreacion.celular = this.empForm.get('celularEmp').value;
    }

    if (this.empForm.get('etnia').value) {
      empleadoCreacion.etnia = this.empForm.get('etnia').value;
    }


    if (this.empForm.get('direccionGral').value) {
      empleadoCreacion.direccion = this.empForm.get('direccionGral').value;
    }

    if (this.empForm.get('direccionGral').value) {
      empleadoCreacion.direccion = this.empForm.get('direccionGral').value;
    }


    empleadoCreacion.codPaisNacionalidad = this.empForm.get('paisNacionadlidad').value;





    empleadoCreacion.codPaisNacimiento = Number(this.empForm.get('paisNacimimiento').value);

    empleadoCreacion.codDepartamentoNacim = Number(this.empForm.get('deptoNacimimiento').value);

    empleadoCreacion.codMunicipioNacim = Number(this.empForm.get('muniNacimimiento').value);

    if (this.fechaNacimiento) {
      empleadoCreacion.fechaNac = String(
        this.fechaNacimiento.day + '/' + this.fechaNacimiento.month + '/' + this.fechaNacimiento.year
      );
    }

    if (this.empForm.get('madreNombre').value) {
      empleadoCreacion.nombreMadre = this.empForm.get('madreNombre').value;
    }


    if (this.empForm.get('madreOcupacion').value) {
      empleadoCreacion.ocupacionMadre = this.empForm.get('madreOcupacion').value;
    }



    if (this.empForm.get('madreTrabajo').value) {
      empleadoCreacion.trabajoMadre = this.empForm.get('madreTrabajo').value;
    }


    if (this.empForm.get('padreNombre').value) {
      empleadoCreacion.nombrePadre = this.empForm.get('padreNombre').value;
    }

    if (this.empForm.get('ocupacionPadre').value) {
      empleadoCreacion.ocupacionPadre = this.empForm.get('ocupacionPadre').value;
    }


    if (this.empForm.get('trabajoPadre').value) {
      empleadoCreacion.trabajoPadre = this.empForm.get('trabajoPadre').value;
    }




    if (this.empForm.get('paisNacionadlidad').value) {
      empleadoCreacion.codPaisNacionalidad = Number(this.empForm.get('paisNacionadlidad').value);
    }

    if (this.empForm.get('departamentoNacionalidad').value) {
      empleadoCreacion.expedicionDui = String(this.empForm.get('departamentoNacionalidad').value);
    }

    if (this.empForm.get('muniNacional').value) {
      empleadoCreacion.muniExpDui = String(this.empForm.get('muniNacional').value);
    }

    empleadoCreacion.numDui = this.empForm.get('documentoIdentidad').value;

    if (this.fechaExpedicionDoc) {
      empleadoCreacion.fechaDui = String(
        this.fechaExpedicionDoc.day + '/' + this.fechaExpedicionDoc.month + '/' + this.fechaExpedicionDoc.year
      );
    }

    if (this.empForm.get('tieneFamiliares').value) {
      empleadoCreacion.conocidoEmpresa = this.empForm.get('tieneFamiliares').value;
    }

    if (this.empForm.get('passaporte').value) {
      empleadoCreacion.numPasaporte = this.empForm.get('passaporte').value;
    }


    if (this.empForm.get('IGSS').value) {
      empleadoCreacion.numIgss = this.empForm.get('IGSS').value;
    }


    if (this.empForm.get('IGSSNombre').value) {
      empleadoCreacion.nombreIsss = this.empForm.get('IGSSNombre').value;
    }


    if (this.empForm.get('ITRA').value) {
      empleadoCreacion.nombreIsss = this.empForm.get('ITRA').value;
    }


    if (this.empForm.get('NIT').value) {
      empleadoCreacion.numNit = this.empForm.get('NIT').value;
    }

    if (this.empForm.get('NITNombre').value) {
      empleadoCreacion.nombreRenta = this.empForm.get('NITNombre').value;
    }





    empleadoCreacion.codBanco = this.empForm.get('banco').value;

    if (this.empForm.get('noCuenta').value) {
      empleadoCreacion.ctaBancaria = this.empForm.get('noCuenta').value;
    }



    if (this.empForm.get('nombreCta').value) {
      empleadoCreacion.nombreAfp = this.empForm.get('nombreCta').value;
    }

    if (this.empForm.get('celularEmp').value) {
      empleadoCreacion.celular = this.empForm.get('celularEmp').value;
    }

    empleadoCreacion.domicilio = this.empForm.get('direccionDui').value;


    empleadoCreacion.licencia = this.empForm.get('licencia').value;

    empleadoCreacion.transporteUSA = this.empForm.get('transporteTrabajar').value;


    empleadoCreacion.habilidadesEspeciales = this.empForm.get('destrezasTecnicas').value;

    empleadoCreacion.tipoVehiculo = this.empForm.get('tipoVehiculoManeja').value;

    empleadoCreacion.computacion = this.empForm.get('computacion').value;




    if (this.cargoFoto) {
      empleadoCreacion.archivoFoto = this.empleadoSelecionado.archivoFoto;
    }


    console.log('EMPLEADO CREACION JSON' + JSON.stringify(empleadoCreacion));
    this.servicioPlanilla.editarEmpleado(empleadoCreacion).subscribe(
      data => {
        console.info('EMPLEADO GUARDADO' + JSON.stringify(data));
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `EMPLEADO  ${data.nombres}-${data.apellidos} MODIFICADO EXITOSAMENTE`,
          showConfirmButton: false,
          timer: 1500
        })
      }, error => {
        console.log('error api' + JSON.stringify(error));
      }
    );



  }


  limpiarForm() {
    this.empForm.reset();
    this.fechaSolicitud = null;
    this.fechaNacimiento = null;
    this.fechaExpedicionDoc = null;
    this.fechaPlanilla = null;
    this.fechaLabores = null;
    this.sexoEmpleado = null;
    this.candidatoSeleccionado = null;
    this.urlFoto = '';
  }



  editarCandidato(): void {




    let candidato: Candidato = new Candidato();

    candidato.candidatoPK = new CandidatoPK();
    candidato.candidatoPK = this.candidatoSeleccionado.candidatoPK;
    candidato.nombre = this.empForm.get('nombres').value;
    candidato.apellido = this.empForm.get('apellidos').value;
    if (this.empForm.get('apCasada').value) {
      candidato.apCasada = this.empForm.get('apCasada').value;
    }



    if (this.fechaSolicitud) {
      let numeroStr: string = "";
      if (Number(this.fechaSolicitud.month) <= 9) {
        numeroStr = "0";
      }
      candidato.fecSolicitud = this.fechaSolicitud.day + '/' + numeroStr + this.fechaSolicitud.month + '/' + this.fechaSolicitud.year;

    }


    if (this.empForm.get('sexo').value) {
      console.log('&&&&&&&&&&&&&&&&&&&&&MODIFICO SEXO CANDIDATO&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      candidato.sexo = Number(this.empForm.get('sexo').value);
    }



    if (this.empForm.get('estadoCivil').value) {
      candidato.estadoCivil = this.empForm.get('estadoCivil').value;
    }


    if (this.empForm.get('incapacidad').value) {
      candidato.discapacidad = this.empForm.get('incapacidad').value;
    }


    if (this.empForm.get('ocupaciones').value) {
      candidato.codOcupacion = this.empForm.get('ocupaciones').value;
    }

    if (this.empForm.get('email').value) {
      candidato.email = this.empForm.get('email').value;
    }


    if (this.empForm.get('paisDomicilio').value) {
      candidato.codPaisDomic = Number(this.empForm.get('paisDomicilio').value);
    }

    if (this.empForm.get('deptoDomicilio').value) {
      candidato.codDepartamentoDomic = Number(this.empForm.get('deptoDomicilio').value);
    }



    if (this.empForm.get('muniDomicilio').value) {
      candidato.codMunicipioDomic = Number(this.empForm.get('muniDomicilio').value);
    }


    if (this.empForm.get('telefonoEmp').value) {
      candidato.telefono = this.empForm.get('telefonoEmp').value;
    }
    if (this.empForm.get('celularEmp').value) {
      candidato.celular = this.empForm.get('celularEmp').value;
    }

    if (this.empForm.get('direccionGral').value) {
      candidato.direccion = this.empForm.get('direccionGral').value;
    }




    if (this.empForm.get('paisNacimimiento').value) {
      candidato.codPaisNacimiento = Number(this.empForm.get('paisNacimimiento').value);
    }

    if (this.empForm.get('deptoNacimimiento').value) {
      candidato.codDepartamentoNacim = Number(this.empForm.get('deptoNacimimiento').value);
    }

    if (this.empForm.get('muniNacimimiento').value) {
      candidato.codMunicipioNacim = Number(this.empForm.get('muniNacimimiento').value);
    }


    if (this.fechaNacimiento) {
      candidato.fechaNac = String(
        this.fechaNacimiento.day + '/' + this.fechaNacimiento.month + '/' + this.fechaNacimiento.year
      );
    }


    if (this.empForm.get('etnia').value) {
      candidato.etnia = Number(this.empForm.get('etnia').value);
    }


    if (this.empForm.get('madreNombre').value) {
      candidato.nombreMadre = this.empForm.get('madreNombre').value;
    }

    if (this.empForm.get('padreNombre').value) {
      candidato.nombrePadre = this.empForm.get('padreNombre').value;
    }




    if (this.empForm.get('paisNacionadlidad').value) {
      candidato.codPaisNacionalidad = Number(this.empForm.get('paisNacionadlidad').value);
    }


    if (this.empForm.get('departamentoNacionalidad').value) {
      candidato.expedicionDui = this.empForm.get('departamentoNacionalidad').value;
    }


    if (this.empForm.get('muniNacional').value) {
      candidato.muniExpDui = String(this.empForm.get('muniNacional').value);
    }

    candidato.numDui = this.empForm.get('documentoIdentidad').value;

    if (this.fechaExpedicionDoc) {
      candidato.fechaExpDui = String(
        this.fechaExpedicionDoc.day + '/' + this.fechaExpedicionDoc.month + '/' + this.fechaExpedicionDoc.year
      );
    }

    if (this.empForm.get('direccionDui').value) {
      candidato.conocidoEmpresa = this.empForm.get('direccionDui').value;
    }

    if (this.empForm.get('passaporte').value) {
      candidato.numPasaporte = this.empForm.get('passaporte').value;
    }

    if (this.empForm.get('IGSS').value) {
      candidato.numIsss = this.empForm.get('IGSS').value;
    }

    if (this.empForm.get('IGSSNombre').value) {
      candidato.nomIsss = this.empForm.get('IGSSNombre').value;
    }

    if (this.empForm.get('ITRA').value) {
      candidato.numNup = this.empForm.get('ITRA').value;
    }

    if (this.empForm.get('NIT').value) {
      candidato.numNit = this.empForm.get('NIT').value;
    }
    if (this.empForm.get('NITNombre').value) {
      candidato.nomNit = this.empForm.get('NITNombre').value;
    }

    if (this.empForm.get('licencia').value) {
      candidato.numLicencia = this.empForm.get('licencia').value;
    }

    if (this.empForm.get('transporteTrabajar').value) {
      candidato.transporteUSA = this.empForm.get('transporteTrabajar').value;
    }
    if (this.empForm.get('destrezasTecnicas').value) {
      candidato.habilidadesEspeciales = this.empForm.get('destrezasTecnicas').value;
    }

    if (this.empForm.get('tipoVehiculoManeja').value) {
      candidato.tipoVehiculo = this.empForm.get('tipoVehiculoManeja').value;
    }

    if (this.empForm.get('computacion').value) {
      candidato.computacion = this.empForm.get('computacion').value;
    }


    if (this.candidatoSeleccionado.archivoFoto) {
      candidato.archivoFoto = this.candidatoSeleccionado.archivoFoto;
    }




    candidato.peso = 0;
    candidato.estatura = 0;
    console.log('OBJETO A GUARDAR::' + JSON.stringify(candidato));

    this.servicioPlanilla.editarCandidato(candidato).subscribe(
      cand => {
        //console.log('RESPUESTA DEL GUARDADO DE CAND..' + JSON.stringify(cand));
        if (cand.candidatoPK) {
          Swal.fire('Editar Candidato', 'Datos Guardados con exito!', 'success');
        } else {
          Swal.fire('No se pudo Editar,Contacte a su administrador');
        }
      }
    );


  }



  guardarCandidato() {

    let candidato: Candidato = new Candidato();
    candidato.candidatoPK = new CandidatoPK();


    candidato.candidatoPK.codCia = 3;
    candidato.nombre = this.empForm.get('nombres').value;
    candidato.apellido = this.empForm.get('apellidos').value;
    candidato.apCasada = this.empForm.get('apCasada').value;


    if (this.fechaSolicitud) {
      candidato.fecSolicitud = String(
        this.fechaSolicitud.day + '/' + this.fechaSolicitud.month + '/' + this.fechaSolicitud.year
      );
    }


    if (this.empForm.get('sexo').value) {
      candidato.sexo = Number(this.empForm.get('sexo').value);
    }

    candidato.estadoCivil = this.empForm.get('estadoCivil').value;
    candidato.discapacidad = this.empForm.get('incapacidad').value;
    candidato.codOcupacion = this.empForm.get('ocupaciones').value;
    candidato.email = this.empForm.get('email').value;

    if (this.empForm.get('paisDomicilio').value) {
      candidato.codPaisDomic = Number(this.empForm.get('paisDomicilio').value);
    }

    if (this.empForm.get('deptoDomicilio').value) {
      candidato.codDepartamentoDomic = Number(this.empForm.get('deptoDomicilio').value);
    }



    if (this.empForm.get('muniDomicilio').value) {
      candidato.codMunicipioDomic = Number(this.empForm.get('muniDomicilio').value);
    }

    candidato.telefono = this.empForm.get('telefonoEmp').value;
    candidato.celular = this.empForm.get('celularEmp').value;
    candidato.direccion = this.empForm.get('direccionGral').value;

    if (this.empForm.get('paisNacimimiento').value) {
      candidato.codPaisNacimiento = Number(this.empForm.get('paisNacimimiento').value);
    }

    if (this.empForm.get('deptoNacimimiento').value) {
      candidato.codDepartamentoNacim = Number(this.empForm.get('deptoNacimimiento').value);
    }

    if (this.empForm.get('muniNacimimiento').value) {
      candidato.codMunicipioNacim = Number(this.empForm.get('muniNacimimiento').value);
    }


    if (this.fechaNacimiento) {
      candidato.fechaNac = String(
        this.fechaNacimiento.day + '/' + this.fechaNacimiento.month + '/' + this.fechaNacimiento.year
      );
    }


    if (this.empForm.get('etnia').value) {
      candidato.etnia = Number(this.empForm.get('etnia').value);
    }



    candidato.nombreMadre = this.empForm.get('madreNombre').value;
    candidato.nombrePadre = this.empForm.get('padreNombre').value;


    if (this.empForm.get('paisNacionadlidad').value) {
      candidato.codPaisNacionalidad = Number(this.empForm.get('paisNacionadlidad').value);
    }


    if (this.empForm.get('departamentoNacionalidad').value) {
      candidato.expedicionDui = this.empForm.get('departamentoNacionalidad').value;
    }


    if (this.empForm.get('muniNacional').value) {
      candidato.muniExpDui = String(this.empForm.get('muniNacional').value);
    }

    candidato.numDui = this.empForm.get('documentoIdentidad').value;

    if (this.fechaExpedicionDoc) {
      candidato.fechaExpDui = String(
        this.fechaExpedicionDoc.day + '/' + this.fechaExpedicionDoc.month + '/' + this.fechaExpedicionDoc.year
      );
    }

    candidato.conocidoEmpresa = this.empForm.get('direccionDui').value;
    candidato.numPasaporte = this.empForm.get('passaporte').value;
    candidato.numIsss = this.empForm.get('IGSS').value;
    candidato.nomIsss = this.empForm.get('IGSSNombre').value;
    candidato.numNup = this.empForm.get('ITRA').value;
    candidato.numNit = this.empForm.get('NIT').value;
    candidato.nomNit = this.empForm.get('NITNombre').value;
    candidato.numLicencia = this.empForm.get('licencia').value;
    candidato.transporteUSA = this.empForm.get('transporteTrabajar').value;
    candidato.habilidadesEspeciales = this.empForm.get('destrezasTecnicas').value;
    candidato.tipoVehiculo = this.empForm.get('tipoVehiculoManeja').value;
    candidato.computacion = this.empForm.get('computacion').value;
    candidato.peso = 0;
    candidato.estatura = 0;

    if (this.candidatoSeleccionado.archivoFoto) {
      candidato.archivoFoto = this.candidatoSeleccionado.archivoFoto;
    }
    else
//  no adjuntaron foto
    {
      candidato.archivoFoto = '';
    }




    console.log('OBJETO A GUARDAR' + JSON.stringify(candidato));


    this.servicioPlanilla.guardarCandidato(candidato).subscribe(
      cand => {
        if (cand.candidatoPK.codCandidato) {
          this.limpiar();

          Swal.fire('Guardar Candidato',
            'Datos Guardados con exito!',
            'success');



        } else {
          Swal.fire('Guardar Candidato',
            'Error al Guardar',
            'error');
        }
      }
    );





  }

  logValidationErrors(group: FormGroup = this.empForm): void {

    Object.keys(group.controls).forEach((key: string) => {

      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        console.log('Validaciones...')
        console.log(messages);
        console.log(abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }

      }

    });

  }


}

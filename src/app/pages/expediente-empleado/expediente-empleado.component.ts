import { JsonPipe } from '@angular/common';
import { JsonpInterceptor } from '@angular/common/http';
import { Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { combineAll } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import Swal from 'sweetalert2';
import { IceSelectComponent } from '../configuraciones/IceSelectComponent';
import { Empleado } from '../modelo/Empleado';
import { FormEmpleadoModel } from '../modelo/formEmpleadoModel';
import { Ocupaciones } from '../modelo/Ocupaciones';
import { OcupacionesPK } from '../modelo/OcupacionesPK';
import { RequestParamReporteEmp } from '../modelo/RequestParamReporteEmp';
import { PlanillaService } from '../servicio/planilla.service';
import { ReportesService } from '../servicio/reportes.service';
import { CustomDateParserFormatter } from '../candidato/form-candidato/modelo/FormatFecha';


@Component({
    selector: 'app-expediente-empleado',
    templateUrl: './expediente-empleado.component.html',
    styleUrls: ['./expediente-empleado.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IceSelectComponent),
            multi: true
        },
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})
export class ExpedienteEmpleadoComponent implements OnInit {
    mostrarAnioReporte: boolean = false;
    cargoFoto: boolean = false;

    fechaExpedicionDoc: NgbDateStruct;
    fechaSolicitud: NgbDateStruct;
    fechaLabores: NgbDateStruct;
    fechaPlanilla: NgbDateStruct;
    fechaFinLabo: NgbDateStruct;
    fechaNacimiento: NgbDateStruct;
    sexoEmpleado: any;
    listaSexo = [
        { label: 'Masculino', valor: 'M' },
        { label: 'Femenino', valor: 'F' }
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
    listaSangre:Array<any>;
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
    listaEmpleados: Array<any>;
    public empleadoSelecionado = new Empleado();
    listaFirmas: Array<any>;
    listaFormato = [
        { label: 'PDF', valor: 1 },
        { label: 'RTF', valor: 2 }
    ];
    listaTipoReportes: Array<any>;
    public _MODULO_PORTAL = 'RRHH_PORTAL';

    formReporteExp: FormGroup;
    requestReporteExpediente: RequestParamReporteEmp = new RequestParamReporteEmp();
    urlFoto: any;
    codigoEmpleado: number;

    constructor(
        private router: Router,
        private _router: ActivatedRoute,
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
        this.servicioPlanilla.logueado=true;

        this._router.paramMap.subscribe( params => {
          console.log('Parametros que llegan.');
          console.log(params);
          const CodCia = +params.get('codCia');
          const CodEmp = +params.get('codEmp');
          console.log('Empleado:'+CodCia+'-'+CodEmp);

           this.obtenerEmpleado(CodCia,CodEmp);
           });


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
            nombres: [''],
            apellidos: [''],
            empresa: [''],
            estadoCivil: [''],
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
            IGSS: [''],
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
            sangre:['']
        });
    }

    createForm() {
        this.formEmpleado = this.fb.group({
            codEmp: [''],
            nombre: [''],
            numDui: ['']
        });
    }

    obtenerEmpresas(cia: number) {
        const objeto = {
            empresa: 3,
            estado:false
        };

        this.servicioPlanilla.obtenerSangre().subscribe((data) => {
            this.listaSangre = data;
            //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
        });

        this.servicioPlanilla.obtenerEmpleados(objeto).subscribe((data) => {
            this.listaEmpleados = data;
            //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
        });

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
        this.servicioPlanilla.obtenerDeptoPais(data.codPais).subscribe((depto) => (this.listadoDepartamentos = depto));
    }

    obtenerDeptoNac(data: any) {
        console.log('Me ejecuto?' + JSON.stringify(data));
        this.codPaisNac = data.codPais;
        this.servicioPlanilla
            .obtenerDeptoPais(data.codPais)
            .subscribe((depto) => (this.listadoDepartamentosNac = depto));
    }

    obtenerDeptoNacionalidad(data: any) {
        this.codPaisNacionalidad = data;
        this.servicioPlanilla
            .obtenerDeptoPais(data.codPais)
            .subscribe((depto) => (this.listaDepartamentosNacionalidad = depto));
    }

    obtenerMunicicipio(data: any) {
        let pais = this.codPaisGral;
        this.servicioPlanilla
            .obtenerMuniDeptoPais(pais, data.deptosPK.codDepto)
            .subscribe((depto) => (this.listaMunicipio = depto));
    }

    obtenerMunicicipioNac(data: any) {
        let pais = this.codPaisNac;

        console.log('llenado municipios' + pais + ',deptop:' + JSON.stringify(data));

        this.servicioPlanilla.obtenerMuniDeptoPais(pais, data).subscribe((depto) => (this.listaMunicipioNac = depto));
    }

    obtenerMunicicipioNacionalidad(data: any) {
        let pais = this.codPaisNacionalidad;
        this.servicioPlanilla
            .obtenerMuniDeptoPais(
                pais,
                data
                )
            .subscribe((depto) => (this.listaMunicipioNacionalidad = depto));

    }

    irPreparacionAcademica() {
        this.router.navigate(['preparacion-academica']);
    }
    irCapacitaciones(codCia : number, codEmp : number) {
      console.log('va a capacitaciones..');
      console.log('cia:'+codCia);
      console.log('emp:'+codEmp);

      this.router.navigate(['/pages/capacitaciones', codCia, codEmp]);
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

    irBeneficiario(cia : number, codemp : number) {
        console.log('va a beneficiarios..');
        console.log('cia:'+cia);
        console.log('emp:'+codemp);

        this.router.navigate(['/pages/beneficiario', cia, codemp]);
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
        let formEmpleado = new FormEmpleadoModel();

        formEmpleado.empresa = 3;
        formEmpleado.estado=false;

        if (this.formEmpleado.get('codEmp').value) {
            formEmpleado.codEmp = Number(this.formEmpleado.get('codEmp').value);
        }

        if (this.formEmpleado.get('nombre').value) {
            formEmpleado.nombre = String(this.formEmpleado.get('nombre').value);
        }

        if (this.formEmpleado.get('numDui').value) {
            formEmpleado.numDui = String(this.formEmpleado.get('numDui').value);
        }

        this.listaEmpleados = [];

        this.servicioPlanilla.obtenerEmpleados(formEmpleado).subscribe
        ((data) => {
            this.listaEmpleados = data;
        });
    }

    limpiar() {
        this.formEmpleado.reset();
        const objeto = {
            empresa: 3,
            estado:false
        };

        this.listaEmpleados = [];

        this.servicioPlanilla.obtenerEmpleados(objeto).subscribe((data) => {
            this.listaEmpleados = data;
        });
    }

    obtenerEmpleado(cia: number, codigo: number) {
        this.empleadoSelecionado =null;
        this.servicioPlanilla.obtenerEmpleado(cia, codigo).subscribe((data) => {
            console.log('################################');
            console.log('------>EL EMPLEADO ASIG' + JSON.stringify(data));
            console.log('-------------------------------------------');
            this.asignarEmpleado(data);
        });
    }

    asignarEmpleado(emp: Empleado) {
        this.empleadoSelecionado = emp;
        console.log('EMPLEADO ASIGNAR:' + JSON.stringify(this.empleadoSelecionado));

        this.empForm.get('nombres').setValue(this.empleadoSelecionado.nombres);
        this.empForm.get('apellidos').setValue(this.empleadoSelecionado.apellidos);
        this.empForm.get('apCasada').setValue(this.empleadoSelecionado.apCasada);
        this.empForm.get('estadoCivil').setValue(this.empleadoSelecionado.estadoCivil);
        this.empForm.get('NIT').setValue(this.empleadoSelecionado.numNit);
        this.codPaisNac = this.empleadoSelecionado.codPaisNacimiento;
        this.codPaisNacionalidad=this.empleadoSelecionado.codPaisNacionalidad;
        this.empForm.get('paisNacionadlidad').setValue(this.empleadoSelecionado.codPaisNacionalidad);
        this.empForm.get('paisNacimimiento').setValue(this.empleadoSelecionado.codPaisNacimiento);
        this.empForm.get('paisDomicilio').setValue(this.empleadoSelecionado.codPais);

        this.servicioPlanilla.obtenerDeptoPais(this.empleadoSelecionado.codPaisNacionalidad).subscribe((depto) => (this.listaDepartamentosNacionalidad = depto));

        this.servicioPlanilla.obtenerMuniDeptoPais(this.empleadoSelecionado.codPaisNacionalidad, Number(this.empleadoSelecionado.expedicionDui)).subscribe((depto) => (this.listaMunicipioNacionalidad = depto));

        this.servicioPlanilla.obtenerDeptoPais(this.empleadoSelecionado.codPais).subscribe((depto) => (this.listadoDepartamentos = depto));

        this.empForm.get('departamentoNacionalidad').setValue(Number(this.empleadoSelecionado.expedicionDui));

        this.empForm.get('deptoDomicilio').setValue(this.empleadoSelecionado.codDepar);

        this.servicioPlanilla.obtenerMuniDeptoPais(this.empleadoSelecionado.codPais, this.empleadoSelecionado.codDepar).subscribe((depto) => (this.listaMunicipio = depto));
        this.empForm.get('muniDomicilio').setValue(this.empleadoSelecionado.codMuni);

        this.empForm.get('muniNacional').setValue(Number(this.empleadoSelecionado.muniExpDui));

        this.empForm.get('passaporte').setValue(this.empleadoSelecionado.numPasaporte);

        this.empForm.get('IGSSNombre').setValue(this.empleadoSelecionado.nombreIsss);



        this.servicioPlanilla.obtenerDeptoPais(this.empForm.get('paisNacimimiento').value).subscribe((depto) => {
            this.listadoDepartamentosNac = depto;
            this.empForm.get('deptoNacimimiento').setValue(this.empleadoSelecionado.codDepartamentoNacim);
        });

        this.listaMunicipioNac = [];

        this.servicioPlanilla
            .obtenerMuniDeptoPais(
                this.empleadoSelecionado.codPaisNacimiento,
                this.empleadoSelecionado.codDepartamentoNacim
            )
            .subscribe((depto) => (this.listaMunicipioNac = depto));

        this.empForm.get('muniNacimimiento').setValue(this.empleadoSelecionado.codMunicipioNacim);

        console.log('el puesto' + this.empleadoSelecionado.codPuesto);
        this.codigoEmpleado = this.empleadoSelecionado.empleadosPK.codEmp;

        this.empForm.get('estadoCivil').setValue(this.empleadoSelecionado.estadoCivil);
        this.empForm.get('empresa').setValue(this.empleadoSelecionado.codArea);
        this.empForm.get('planta').setValue(this.empleadoSelecionado.codSucursal);
        this.empForm.get('direccion').setValue(this.empleadoSelecionado.codGerencia);
        this.empForm.get('departamento').setValue(this.empleadoSelecionado.codDepto);
        this.empForm.get('puesto').setValue(this.empleadoSelecionado.codPuesto);
        this.empForm.get('planilla').setValue(this.empleadoSelecionado.codTipoPla);
        this.empForm.get('clasificacion').setValue(this.empleadoSelecionado.codClasificacion);
        this.empForm.get('plaza').setValue(this.empleadoSelecionado.codJurisdiccion);
        this.empForm.get('salario').setValue(this.empleadoSelecionado.salarioBase);
        this.empForm.get('formaPago').setValue(this.empleadoSelecionado.chequeDep);
        this.empForm.get('madreNombre').setValue(this.empleadoSelecionado.nombreMadre);
        this.empForm.get('madreOcupacion').setValue(this.empleadoSelecionado.ocupacionMadre);
        this.empForm.get('madreTrabajo').setValue(this.empleadoSelecionado.trabajoMadre);
        this.empForm.get('padreNombre').setValue(this.empleadoSelecionado.nombrePadre);
        this.empForm.get('ocupacionPadre').setValue(this.empleadoSelecionado.ocupacionPadre);
        this.empForm.get('trabajoPadre').setValue(this.empleadoSelecionado.trabajoPadre);
        this.empForm.get('telefonoEmp').setValue(this.empleadoSelecionado.telefonos);
        this.empForm.get('celularEmp').setValue(this.empleadoSelecionado.celular);
        this.empForm.get('direccionGral').setValue(this.empleadoSelecionado.direccion);
        this.empForm.get('etnia').setValue(this.empleadoSelecionado.codEtnia);
        this.empForm.get('madreNombre').setValue(this.empleadoSelecionado.nombreMadre);
        this.empForm.get('madreOcupacion').setValue(this.empleadoSelecionado.ocupacionMadre);
        this.empForm.get('madreTrabajo').setValue(this.empleadoSelecionado.trabajoMadre);
        this.empForm.get('padreNombre').setValue(this.empleadoSelecionado.nombrePadre);
        this.empForm.get('ocupacionPadre').setValue(this.empleadoSelecionado.trabajoPadre);
        this.empForm.get('trabajoPadre').setValue(this.empleadoSelecionado.trabajoPadre);
        this.empForm.get('direccionDui').setValue(this.empleadoSelecionado.domicilio);
        this.empForm.get('noCuenta').setValue(this.empleadoSelecionado.ctaBancaria);




        if (this.empleadoSelecionado.aportacionPolitica != null) {
            console.log('this.empleadoSelecionado.aportacionPolitica' + this.empleadoSelecionado.aportacionPolitica);

            this.empForm.get('pagoDolares').setValue(String(this.empleadoSelecionado.aportacionPolitica));
        }


        if (this.empleadoSelecionado.fechaDui) {
            let ArrayFechaNacionalSol = this.empleadoSelecionado.fechaDui.split('/');
            this.fechaExpedicionDoc = this.calendar.getToday();
            this.fechaExpedicionDoc.day = Number(ArrayFechaNacionalSol[0]);
            this.fechaExpedicionDoc.month = Number(ArrayFechaNacionalSol[1]);
            this.fechaExpedicionDoc.year = Number(ArrayFechaNacionalSol[2]);

        }


        if (this.empleadoSelecionado.fecIngreso) {
            let ArrayFechaNacSol = this.empleadoSelecionado.fecIngreso.split('/');
            this.fechaSolicitud = this.calendar.getToday();
            this.fechaSolicitud.day = Number(ArrayFechaNacSol[0]);
            this.fechaSolicitud.month = Number(ArrayFechaNacSol[1]);
            this.fechaSolicitud.year = Number(ArrayFechaNacSol[2]);
            console.log('fecha nacimiento' + JSON.stringify(ArrayFechaNacSol));
        }

        if (this.empleadoSelecionado.fechaRealPlanilla) {
            let ArrayFechaNpal = this.empleadoSelecionado.fechaRealPlanilla.split('/');
            this.fechaPlanilla = this.calendar.getToday();
            this.fechaPlanilla.day = Number(ArrayFechaNpal[0]);
            this.fechaPlanilla.month = Number(ArrayFechaNpal[1]);
            this.fechaPlanilla.year = Number(ArrayFechaNpal[2]);
            console.log('fecha nacimiento' + JSON.stringify(ArrayFechaNpal));
        }

        if (this.empleadoSelecionado.fecIngreso) {
            let ArrayFechaNacSol = this.empleadoSelecionado.fecIngreso.split('/');
            this.fechaLabores = this.calendar.getToday();
            this.fechaLabores.day = Number(ArrayFechaNacSol[0]);
            this.fechaLabores.month = Number(ArrayFechaNacSol[1]);
            this.fechaLabores.year = Number(ArrayFechaNacSol[2]);
            console.log('fecha nacimiento' + JSON.stringify(ArrayFechaNacSol));
        }

        if (this.empleadoSelecionado.fechaNac) {
            let ArrayFechaNac = this.empleadoSelecionado.fechaNac.split('/');
            this.fechaNacimiento = this.calendar.getToday();
            this.fechaNacimiento.day = Number(ArrayFechaNac[0]);
            this.fechaNacimiento.month = Number(ArrayFechaNac[1]);
            this.fechaNacimiento.year = Number(ArrayFechaNac[2]);
            console.log('fecha nacimiento' + JSON.stringify(ArrayFechaNac));
        }

        if (this.empleadoSelecionado.deConfianza) {
            this.empForm.get('jubilado').setValue(String(this.empleadoSelecionado.deConfianza));
        } else {
            this.empForm.get('jubilado').setValue('-1');
        }

        if (this.empleadoSelecionado.ocupaciones) {
            this.empForm.get('ocupaciones').setValue(this.empleadoSelecionado.ocupaciones.ocupacionesPK.codOcupacion);
        }

        if (this.empleadoSelecionado.sexo == 1) {
            this.sexoEmpleado = 'M';
        } else {
            this.sexoEmpleado = 'F';
        }



        this.empForm.get('tieneFamiliares').setValue(this.empleadoSelecionado.conocidoEmpresa);

        this.empForm.get('passaporte').setValue(this.empleadoSelecionado.numPasaporte);

        this.empForm.get('IGSS').setValue(this.empleadoSelecionado.numIgss);

        this.empForm.get('IGSSNombre').setValue(this.empleadoSelecionado.nombreIsss);

        this.empForm.get('ITRA').setValue(this.empleadoSelecionado.nombreIsss);

        this.empForm.get('NIT').setValue(this.empleadoSelecionado.numNit);

        this.empForm.get('NITNombre').setValue(this.empleadoSelecionado.nombreRenta);
        this.empForm.get('bonificacion').setValue(this.empleadoSelecionado.bonificacion);

        if(this.empleadoSelecionado.bonificacion){
            this.empForm.get('ingreso').setValue(Number(this.empleadoSelecionado.bonificacion)+Number(this.empleadoSelecionado.salarioBase));
         }

         this.empForm.get('estadoEmp').setValue(this.empleadoSelecionado.status=='A' ? 'ACTIVO':'INACTIVO');

         this.empForm.get('controlEntrada').setValue(this.empleadoSelecionado.controlEntrada);

        this.empForm.get('banco').setValue(this.empleadoSelecionado.codBanco);
        this.empForm.get('documentoIdentidad').setValue(this.empleadoSelecionado.numDui);
        this.empForm.get('nombreCta').setValue(this.empleadoSelecionado.nombreAfp);
        this.empForm.get('licencia').setValue(this.empleadoSelecionado.licencia);
        this.empForm.get('transporteTrabajar').setValue(this.empleadoSelecionado.transporteUSA);
        this.empForm.get('destrezasTecnicas').setValue(this.empleadoSelecionado.habilidadesEspeciales);
        this.empForm.get('tipoVehiculoManeja').setValue(this.empleadoSelecionado.tipoVehiculo);
        this.empForm.get('computacion').setValue(this.empleadoSelecionado.computacion);
        this.empForm.get('sangre').setValue(this.empleadoSelecionado.tipoSangre);


        if (this.empleadoSelecionado.archivoFoto) {
            this.visualizarBase64URL(this.empleadoSelecionado.archivoFoto);
        }
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


        let  delims:string=",";
        let parts:String[]=String(dataArchivo).split(delims);
        let delims2:string=";";
        let parts2:String[]=parts[0].split(delims2);
        console.log('Tipo de content type:'+parts[0]);
        let delims3:string=":";
        let parts3:string[]=parts2[0].split(delims3);


        const contentType = parts3[1];
        let b64Data = String(dataArchivo).replace(parts[0]+',', '');
        ////console.log('La data que llega al visor de pdf:' + b64Data);

        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        //asignar foto a empleado

        this.empleadoSelecionado.archivoFoto = b64Data;
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
        if(this.sexoEmpleado){
            empleadoCreacion.sexo = Number(this.sexoEmpleado);
        }

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
            empleadoCreacion.ocupaciones=new  Ocupaciones();
            empleadoCreacion.ocupaciones.ocupacionesPK=new OcupacionesPK();

            empleadoCreacion.ocupaciones.ocupacionesPK.codCia=3;
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

        if(this.empForm.get('estadoEmp').value){
            console.log('STATUS #######'+this.empleadoSelecionado.status);
            empleadoCreacion.status = this.empleadoSelecionado.status;
        }


        empleadoCreacion.codPais = this.empForm.get('paisDomicilio').value;

        empleadoCreacion.codDepar = this.empForm.get('deptoDomicilio').value;

        empleadoCreacion.codMuni = this.empForm.get('muniDomicilio').value;
        if(this.empForm.get('telefonoEmp').value){
            empleadoCreacion.telefonos = this.empForm.get('telefonoEmp').value;
        }

        if( this.empForm.get('celularEmp').value){
            empleadoCreacion.celular = this.empForm.get('celularEmp').value;
        }

        if(this.empForm.get('etnia').value){
            empleadoCreacion.etnia = this.empForm.get('etnia').value;
        }


        if(this.empForm.get('direccionGral').value){
            empleadoCreacion.direccion = this.empForm.get('direccionGral').value;
        }

        if(this.empForm.get('direccionGral').value){
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

        if(this.empForm.get('madreNombre').value){
            empleadoCreacion.nombreMadre = this.empForm.get('madreNombre').value;
        }


        if( this.empForm.get('madreOcupacion').value){
            empleadoCreacion.ocupacionMadre = this.empForm.get('madreOcupacion').value;
        }



        if(this.empForm.get('madreTrabajo').value){
            empleadoCreacion.trabajoMadre = this.empForm.get('madreTrabajo').value;
        }


        if(this.empForm.get('padreNombre').value){
            empleadoCreacion.nombrePadre = this.empForm.get('padreNombre').value;
        }

        if(this.empForm.get('ocupacionPadre').value){
            empleadoCreacion.ocupacionPadre = this.empForm.get('ocupacionPadre').value;
        }


        if( this.empForm.get('trabajoPadre').value){
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

        if(this.empForm.get('noCuenta').value){
            empleadoCreacion.ctaBancaria = this.empForm.get('noCuenta').value;
        }



        if(this.empForm.get('nombreCta').value){
            empleadoCreacion.nombreAfp = this.empForm.get('nombreCta').value;
        }

        if(this.empForm.get('celularEmp').value){
            empleadoCreacion.celular = this.empForm.get('celularEmp').value;
        }

        empleadoCreacion.domicilio=this.empForm.get('direccionDui').value;


        empleadoCreacion.licencia = this.empForm.get('licencia').value;

        empleadoCreacion.transporteUSA = this.empForm.get('transporteTrabajar').value;


        empleadoCreacion.habilidadesEspeciales = this.empForm.get('destrezasTecnicas').value;

        empleadoCreacion.tipoVehiculo = this.empForm.get('tipoVehiculoManeja').value;

        empleadoCreacion.computacion = this.empForm.get('computacion').value;
        if(this.sexoEmpleado){
            empleadoCreacion.sexo= this.sexoEmpleado=='F'?2:1;
        }




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


    limpiarForm(){
        this.empForm.reset();
        this.fechaSolicitud=null;
        this.fechaNacimiento=null;
        this.fechaExpedicionDoc=null;
        this.fechaPlanilla=null;
        this.fechaLabores=null;
        this.empleadoSelecionado=null;
    }
}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Candidato } from "../candidato/form-candidato/modelo/Candidato";
import { Contrato } from "../candidato/form-candidato/modelo/Contrato";
import { Gerencia } from "../candidato/form-candidato/modelo/Gerencia";
import { GerenciaPK } from "../candidato/form-candidato/modelo/GerenciaPK";
import { RequestContratacion } from "../candidato/form-candidato/modelo/RequestContratacion";
import { TiposPlanillaPK } from "../candidato/form-candidato/modelo/TiposPlanillaPK";
import { TiposPlanilla } from "../formPlanilla/form-planilla/modeloPlanilla/TiposPlanilla";
import { Empleado } from "../modelo/Empleado";
import { PlanillaService } from "../servicio/planilla.service";
import { CustomDateParserFormatter } from "../candidato/form-candidato/modelo/FormatFecha";
import { BuscarCandidatoModel } from "../modelo/BuscarCandidato";


@Component({
    selector: 'contratacion-directa',
    templateUrl: './contratacion-directa.component.html',
    styleUrls: ['./contratacion-directa.css'],
    providers: [
      {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
    ]
})


export class ContratacionDirectaComponent {

    p: number = 1;

    contratacionForm: FormGroup;

    banderaElementos: boolean = false;

    listaCandidato: Candidato[] = [];
    plazas: Array<any> = [];
    listaTiposPlanilla: TiposPlanilla[] = [];
    listaPuesto: Array<any> = [];
    listadoRepresentantesPatronal: Empleado[] = [];
    listaGerencias: Array<any> = [];
    listaTiposContrato: Array<any> = [{ "valor": "P", "label": "Contrato" }, { "valor": "P", "label": "Ley de Salario" }, { "valor": "E", "label": "Interinato" }];
    listaEstadoContrato: Array<any> = [{ valor: "1", label: "Generado" }, { valor: "2", label: "Anulado" }, { valor: "3", label: "Finalizado" }]
    listaClasificacionEmpleado: Array<any>;
    listaDepto:Array<any>=[];
    fechaInicio: NgbDateStruct;
    fechaFin: NgbDateStruct;
    plazaSeleccion: any;
    listaAgencia: Array<any> = [];
    candidatoSeleccion: Candidato = new Candidato();


    constructor(private fb: FormBuilder, private planillaService: PlanillaService, private calendar: NgbCalendar) {

    }


    ngOnInit() {

        this.llenarListas();
        this.crearContratacionForm();

    }



    llenarListas(): void {

        this.planillaService.logueado = true;
        this.planillaService.listarCandidadoEstado(3, 'A').subscribe(data => this.listaCandidato = data);
        this.planillaService.obtenerClasificacionEmpleado(3).subscribe(data => this.listaClasificacionEmpleado = data);
        this.planillaService.obtenerPatrono(3).subscribe(data => this.listadoRepresentantesPatronal = data);
        this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(data => this.listaTiposPlanilla = data);
        this.planillaService.obtenerPuestos(3).subscribe(data => this.listaPuesto = data);
        this.planillaService.obtenerDireccion(3).subscribe(data => this.listaGerencias = data);
        this.planillaService.obtenerPosiciones(3,"V").subscribe(data => this.plazas = data);
        this.planillaService.obtenerPlanta(3).subscribe(data => this.listaAgencia = data);
        this.planillaService.obtenerDepartamento(3).subscribe(data=>this.listaDepto=data);

    }




    mostrar(candidato: any): void {
        this.banderaElementos = !this.banderaElementos;
        this.candidatoSeleccion = candidato;
        //console.log('CANDIDATO SELECCION'+JSON.stringify(this.candidatoSeleccion));

    }




    seleccionarPlaza(data: any): void {
        this.plazaSeleccion = data;
        console.log(JSON.stringify(data));
        if(data.salario){
            this.contratacionForm.get('salario').setValue(Number(data.salario));
        }

        this.contratacionForm.get('codDepartamento').setValue(data.departamentos.departamentosPK.codDepto);
        this.contratacionForm.get('codGerencia').setValue(data.gerencia.gerenciaPK.codGerencia);
        this.contratacionForm.get('puesto').setValue(data.puestos.puestosPK.codPuesto);


        // codDepartamento: [],
        // codAgencia: [],
        // representantePatronal: [],
        // tipo: [],
        // tipoPlanilla: [],
        // puesto: [],
        // salario: [],
        // bono: [],
        // codJurisdiccion: []


    }


    contratar(): void {

        let contratacion = new RequestContratacion();

        contratacion.candidato = new Candidato();
        contratacion.candidato = this.candidatoSeleccion;
        contratacion.gerencia = new Gerencia();
        contratacion.gerencia.gerenciaPK = new GerenciaPK();
        contratacion.gerencia.gerenciaPK.codCia = 3;

        if (this.contratacionForm.get('codDepartamento').value) {

            contratacion.codDepartamento = Number(this.contratacionForm.get('codDepartamento').value);

        }


        if (this.contratacionForm.get('codAgencia').value) {
            contratacion.codAgencia = Number(this.contratacionForm.get('codAgencia').value);
        }


        if (this.contratacionForm.get('codGerencia').value) {
            contratacion.gerencia.gerenciaPK.codGerencia = Number(this.contratacionForm.get('codGerencia').value);
        }



        contratacion.contrato = new Contrato();


        if (this.contratacionForm.get('clasificacionEmp').value) {
            contratacion.contrato.codClasificacion = Number(this.contratacionForm.get('clasificacionEmp').value);
        }

        if (this.fechaInicio) {
            contratacion.contrato.fechaInicio = this.fechaInicio.year + '-' + this.fechaInicio.month + '-' + this.fechaInicio.day + ' ' + '00:00:00.000';
        }

        if (this.fechaFin) {
            contratacion.contrato.fechaFinal = this.fechaFin.year + '-' + this.fechaFin.month + '-' + this.fechaFin.day + ' ' + '00:00:00.000';
        }


        if (this.contratacionForm.get('representantePatronal').value) {
            contratacion.representantePatronal = Number(this.contratacionForm.get('representantePatronal').value);
        }


        if (this.contratacionForm.get('tipo').value) {
            contratacion.contrato.tipo = this.contratacionForm.get('tipo').value;

        }

        if (this.contratacionForm.get('tipoPlanilla').value) {
            contratacion.contrato.tiposPlanilla = new TiposPlanilla();
            contratacion.contrato.tiposPlanilla.tiposPlanillaPK = new TiposPlanillaPK();
            contratacion.contrato.tiposPlanilla.tiposPlanillaPK.codCia = 3;
            contratacion.contrato.tiposPlanilla.tiposPlanillaPK.codTipopla = this.contratacionForm.get('tipoPlanilla').value;

        }



        if (this.contratacionForm.get('puesto').value) {

            contratacion.codPuesto = Number(this.contratacionForm.get('puesto').value);
            contratacion.contrato.codPuesto = Number(this.contratacionForm.get('puesto').value);
        }

        if (this.contratacionForm.get('salario').value) {

            contratacion.contrato.salario = Number(this.contratacionForm.get('salario').value);
        }


        if (this.contratacionForm.get('bono').value) {

            contratacion.bonificacion = Number(this.contratacionForm.get('bono').value);
        }

        if (this.plazaSeleccion) {

            contratacion.codJurisdiccion = Number(this.plazaSeleccion?.plaza?.plazaPK?.codPlaza);
        }



        contratacion.contrato.candidato = new Candidato();
        contratacion.contrato.candidato = this.candidatoSeleccion;
        contratacion.candidato = new Candidato();
        contratacion.candidato = this.candidatoSeleccion;
        contratacion.contrato.estado = "G";
        this.banderaElementos=false;

        console.log('LO QUE MANDO AL OBJETO GUARDAR' + JSON.stringify(contratacion));

        this.planillaService.contratar(contratacion).subscribe(data => {
            Swal.fire('Contratacion exitosa!');
            console.log('LO QUE VIENE EL CONTRATAR:' + JSON.stringify(data));
            this.contratacionForm.reset();
            this.plazaSeleccion = null;
            this.fechaInicio = null;
            this.fechaFin = null;
        }

        );






    }


    crearContratacionForm(): void {
        this.contratacionForm = this.fb.group({
            clasificacionEmp: [, []],
            codGerencia: [],
            codDepartamento: [],
            codAgencia: [],
            representantePatronal: [],
            tipo: [],
            tipoPlanilla: [],
            puesto: [],
            salario: [],
            bono: [],
            codJurisdiccion: []
        });
    }





}

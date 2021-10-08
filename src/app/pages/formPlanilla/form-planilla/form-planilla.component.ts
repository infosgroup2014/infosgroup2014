import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PlanillaService } from '../../servicio/planilla.service';
import { ProgramacionPla } from './modeloPlanilla/ProgramacionPla';
import { ProgramacionPlaPK } from './modeloPlanilla/ProgramacionPlaPK';
import { TiposPlanilla } from './modeloPlanilla/TiposPlanilla';
import { TiposPlanillaPK } from './modeloPlanilla/TiposPlanillaPK';
import { NgbDateFRParserFormatter } from '../../formatos/ngb-date-fr-parser-formatter';




@Component({
    selector: 'app-form-planilla',
    templateUrl: './form-planilla.component.html',
    styleUrls: ['./form-planilla.component.css','./form-planilla.scss'],
    providers: [
      { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }
    ]
})
export class FormPlanillaComponent implements OnInit {
    listaTipoPlanilla: any;
    meses = [
        { valor: 1, mes: 'Enero' },
        { valor: 2, mes: 'Febrero' },
        { valor: 3, mes: 'Marzo' },
        { valor: 4, mes: 'Abril' },
        { valor: 5, mes: 'Mayo' },
        { valor: 6, mes: 'Junio' },
        { valor: 7, mes: 'Julio' },
        { valor: 8, mes: 'Agosto' },
        { valor: 9, mes: 'Septiembre' },
        { valor: 10, mes: 'Octubre' },
        { valor: 11, mes: 'Noviembre' },
        { valor: 12, mes: 'Diciembre' }
    ];
    periodo = [
        { codigo: 1, valor: 'Quincena Uno' },
        { codigo: 2, valor: 'Quincena Dos' }
    ];
    fechaInicial: NgbDateStruct;
    fechaFinal: NgbDateStruct;
    fechaPago: NgbDateStruct;
    fechaInicialHX: NgbDateStruct;
    fechaFinalHX: NgbDateStruct;
    fechaInicialNoc: NgbDateStruct;
    fechaFinalNoc: NgbDateStruct;
    fechaInicialAlimento: NgbDateStruct;
    fechaFinAlimento: NgbDateStruct;
    planillaForm: FormGroup;

    date: { year: number; month: number };

    constructor(
        private planillaService: PlanillaService,
        private router: Router,
        private calendar: NgbCalendar,
        private fb: FormBuilder
    ) {
        this.fechaInicial = this.calendar.getToday();

        this.planillaForm = this.fb.group({
            codTipopla: [''],
            anio: [''],
            mese: [''],
            periodo: [''],
            proyectar: [''],
            descontar: [''],
            cuota: [''],
            comentario: [''],
            anioPrestamo: [''],
            mesPrestamo: [''],
            factorCambiario: [1],
            nota: [''],

        });

        this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(
            data => {
                this.listaTipoPlanilla = data;
            }
        );
    }

    ngOnInit(): void {
        this.planillaService.logueado=true;
        this.datosPordefecto();
     }


     datosPordefecto(){
      this.planillaForm.get('anioPrestamo').setValue(Number(this.fechaInicial.year));
      this.planillaForm.get('anio').setValue(Number(this.fechaInicial.year));
      this.planillaForm.get('mese').setValue(Number(this.fechaInicial.month));
      this.planillaForm.get('mesPrestamo').setValue(Number(this.fechaInicial.month));
      this.planillaForm.get('descontar').setValue(Number(1));
      this.planillaForm.get('cuota').setValue(Number(2));
     }

    guardarPlanilla() {


        let objetoPlanilla = new ProgramacionPla();
        objetoPlanilla.programacionPlaPK = new ProgramacionPlaPK();
        objetoPlanilla.programacionPlaPK.codCia = 3;
        objetoPlanilla.programacionPlaPK.periodo = Number(this.planillaForm.get('anio').value);
        objetoPlanilla.programacionPlaPK.codTipopla = this.planillaForm.get('codTipopla').value;
        objetoPlanilla.quincena = Number(this.planillaForm.get('periodo').value);
        objetoPlanilla.status = 'G';
        objetoPlanilla.anio = Number(this.planillaForm.get('anio').value);
        objetoPlanilla.mes = Number(this.planillaForm.get('mese').value);
        const fechaConstDate = this.fechaInicial;
        objetoPlanilla.fechaInicial = fechaConstDate.day + '/' + fechaConstDate.month + '/' + fechaConstDate.year;
        const fechaFinalConstDate = this.fechaFinal;
        objetoPlanilla.fechaFinal = fechaFinalConstDate.day + '/' + fechaFinalConstDate.month + '/' + fechaFinalConstDate.year;
        objetoPlanilla.tiposPlanilla = new TiposPlanilla();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK = new TiposPlanillaPK();
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codCia = 3;
        objetoPlanilla.tiposPlanilla.tiposPlanillaPK.codTipopla = Number(this.planillaForm.get('codTipopla').value);
        objetoPlanilla.diasProyectar = Number(this.planillaForm.get('proyectar').value);
      //////////////////////EMPLEADO
        objetoPlanilla.codEmpRealiza=394
///////////////////////////////////

        if(this.fechaInicialNoc){
            const fechaInicialNoc = this.fechaInicialNoc;
            objetoPlanilla.fechaInicioNoct = fechaInicialNoc.day + '/' + fechaInicialNoc.month + '/' + fechaInicialNoc.year;

        }

        if(this.fechaFinalNoc){
            const fechaFinalNocs = this.fechaFinalNoc;
            objetoPlanilla.fechaFinNoct = fechaFinalNocs.day + '/' + fechaFinalNocs.month + '/' + fechaFinalNocs.year;

        }

        if (this.fechaInicialHX) {
            const fechaInicialHXConstDate = this.fechaInicialHX;
            objetoPlanilla.fechaInicioHx = fechaInicialHXConstDate.day + '/' + fechaInicialHXConstDate.month + '/' + fechaInicialHXConstDate.year;

        }

        if(this.fechaFinalHX){
            const fechaFinalHX = this.fechaFinalHX;
            objetoPlanilla.fechaFinHx = fechaFinalHX.day + '/' + fechaFinalHX.month + '/' + fechaFinalHX.year;

        }

        if(this.fechaInicialAlimento){
            const fechaInicialAlimento = this.fechaInicialAlimento;
            objetoPlanilla.fecInitial = fechaInicialAlimento.day + '/' + fechaInicialAlimento.month + '/' + fechaInicialAlimento.year;

        }


        if(this.fechaFinAlimento){
            const fechaFinalAlimento = this.fechaFinAlimento;
            objetoPlanilla.fecEnded = fechaFinalAlimento.day + '/' + fechaFinalAlimento.month + '/' + fechaFinalAlimento.year;

        }

        console.log('Ingreso a la fecha paGo:'+this.fechaPago.day);
        const fechaPaid = this.fechaPago;
        objetoPlanilla.fechaPago = fechaPaid.day + '/' + fechaPaid.month + '/' + fechaPaid.year;



        objetoPlanilla.comentario = this.planillaForm.get('comentario').value;
        objetoPlanilla.observacion = this.planillaForm.get('nota').value;

        if (this.planillaForm.get('cuota').value) {
            objetoPlanilla.descontar = this.planillaForm.get('cuota').value;
        }

        if (this.planillaForm.get('factorCambiario').value) {
            objetoPlanilla.factorCambiario = Number(this.planillaForm.get('factorCambiario').value);
        }

        if (this.planillaForm.get('mesPrestamo').value) {
            objetoPlanilla.mesReportar = this.planillaForm.get('mesPrestamo').value;
        }

        if(this.planillaForm.get('proyectar').value){
        objetoPlanilla.diasProyectar=Number(this.planillaForm.get('proyectar').value);
        }



        //console.log(JSON.stringify(this.planillaForm.value));
        console.log('Fecha Inicial' + JSON.stringify(this.fechaInicial));

        console.log('Objeto que se manda a guardar' + JSON.stringify(objetoPlanilla));

        this.planillaService.guardarPlanilla(objetoPlanilla).subscribe(planillaSav => {
            //console.log(JSON.stringify(planillaSav));
            Swal.fire({
                title: 'Registro de planilla',
                text: 'Planilla Guardada con exito',
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Cerrar'
            }).then((result) => {
                if (result.value) {
                    this.router.navigateByUrl('/pages/planilla');
                }
            });
        });
    }



    irPlanilla() {
        this.router.navigate(['./pages/planilla'])
    }


    editarPlanilla() {

    }



    obtenerFechas() {
        let anio = this.planillaForm.get('anio').value;
        let mes = this.planillaForm.get('mese').value;
        let quincena = this.planillaForm.get('periodo').value;


        if(anio && mes && quincena){

            this.planillaService.obtenerFechas(
                3, anio, mes, quincena
            ).subscribe(

                fecha => {
                    console.log('OBTENER RESPUESTAS FECHAS'+JSON.stringify(fecha));
                    this.asignarFechas(fecha);
                }
            );

        }


    }




    asignarFechas(valor: any) {
        let fechaInicioStr: string = valor.fechaInicial;
        let fechaFinalStr: string = valor.fechaFinal;

        let fechaInicioHxStr: string = valor.fechaInicioHx;
        let fechaFinHxStr: string = valor.fechaFinHx;

        if (fechaInicioHxStr) {
            const arrayFechaInicioHX = fechaInicioHxStr.split('/');

            const fechas = {
                "year": Number(arrayFechaInicioHX[2]),
                "month": Number(arrayFechaInicioHX[1]),
                "day": Number(arrayFechaInicioHX[0])
            };

            this.fechaInicialHX = fechas;
        }



        if(fechaFinHxStr){
            const arrayFechaFinHX = fechaFinHxStr.split('/');

            const fechas = {
                "year": Number(arrayFechaFinHX[2]),
                "month": Number(arrayFechaFinHX[1]),
                "day": Number(arrayFechaFinHX[0])
            };

            this.fechaFinalHX = fechas;


        }





        if (fechaInicioStr) {
            const arrayFechaInicio = fechaInicioStr.split('/');

            const fechas = {
                "year": Number(arrayFechaInicio[2]),
                "month": Number(arrayFechaInicio[1]),
                "day": Number(arrayFechaInicio[0])
            };

            this.fechaInicial = fechas;
        }


        if(fechaFinalStr){
            const arrayFechaFin = fechaFinalStr.split('/');

            const fechas = {
                "year": Number(arrayFechaFin[2]),
                "month": Number(arrayFechaFin[1]),
                "day": Number(arrayFechaFin[0])
            };

            this.fechaFinal = fechas;
        }

        //console.log('fehcas' + JSON.stringify(valor));

    }



}

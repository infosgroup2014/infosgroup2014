import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProgramacionPla } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { ArchivoHX } from '../modelo/ArchivoHX';
import { PlanillaService } from '../servicio/planilla.service';

@Component({
    selector: 'app-deducciones',
    templateUrl: './deducciones.component.html',
    styleUrls: ['./deducciones.css']
})

export class DeduccionesComponent implements OnInit {

    listadoTipoPlanilla: Array<any>;
    listadoPrograPla: Array<any>;

    keyword = 'nomTipopla';
    keywordPla = 'stringProgramacionPla';
    habilitarUpload: boolean = true;
    archivoHXObjecto: ArchivoHX;
    listaResumenByProgramacion: Array<any>;
    listadoDeducPresta:Array<any>;
    p: number = 1;



    constructor(private servicioRRhhEmpApi: PlanillaService) {

        servicioRRhhEmpApi.obtenerTiposPlanilla(3, 2).subscribe(
            data => {
                this.listadoTipoPlanilla = data;
            }
        );

    }

    ngOnInit(): void {
    }




    selectEvent(item) {
        console.log('Lo que selecciono' + JSON.stringify(item));

        this.servicioRRhhEmpApi.obtenerProgramacionCloser(item.tiposPlanillaPK.codCia, item.tiposPlanillaPK.codTipopla).subscribe(
            prograPla => {
                console.log('cambios' + JSON.stringify(prograPla));
                this.listadoPrograPla = prograPla;
            }
        );

    }



    deshabilitaUpload() {
        this.habilitarUpload = true;
    }



    handleUpload(event) {
        let baseArch: string;
        if (event.target.value) {
            const file = event.target.files[0];
            const type = file.type;
            this.changeFile(file).then((base64: string): any => {
                baseArch = base64;
                let dataArray = baseArch.split(',');
                this.consumirHorasExtras(dataArray[1]);
            });
        } else alert('Nothing')


    }



    changeFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    selectProgramacionPlaEvent(item) {
        this.habilitarUpload = false;
        console.log('programacionpla:' + JSON.stringify(item));
        this.archivoHXObjecto = new ArchivoHX();
        this.archivoHXObjecto.programacionPla = new ProgramacionPla();
        this.archivoHXObjecto.programacionPla = item;


        this.servicioRRhhEmpApi.obtenerResumenByProgramacion(
            item.programacionPlaPK.codCia,
            item.mes, item.anio,
            item.tiposPlanilla.tiposPlanillaPK.codTipopla,
            item.numPlanilla).subscribe(resumen => this.listaResumenByProgramacion = resumen

            );
    }



    consumirHorasExtras(base64: any) {
        this.archivoHXObjecto.archivo = base64;
        this.archivoHXObjecto.planta = null;
        this.archivoHXObjecto.username = 'RH_HUMANOS.3';
        this.archivoHXObjecto.codEmpleadoSesion = 47;

        console.log('Archivos to API:' + JSON.stringify(this.archivoHXObjecto));


        this.servicioRRhhEmpApi.cargarMovDP(this.archivoHXObjecto).subscribe(
            archive => {
                //console.log('RESPUESTA TO API'+JSON.stringify(archive));
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: archive.mensaje,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        );
    }

    deleteEvent(item) {
        console.log('Lo que elimino' + JSON.stringify(item));
    }



    obtenerDetalleDeducciones(item:any){
        this.servicioRRhhEmpApi.obtenerDetalleDeducPresta(this.archivoHXObjecto.programacionPla.programacionPlaPK.codCia,
            this.archivoHXObjecto.programacionPla.programacionPlaPK.periodo,
            this.archivoHXObjecto.programacionPla.programacionPlaPK.secuencia,
            this.archivoHXObjecto.programacionPla.tiposPlanilla.tiposPlanillaPK.codTipopla,item.codDp).subscribe(deduc=>this.listadoDeducPresta=deduc);

    }


}

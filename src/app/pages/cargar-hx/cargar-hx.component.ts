import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProgramacionPla } from '../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla';
import { PlanillaService } from '../servicio/planilla.service';
import { ArchivoHX } from './modelo/ArchivoHX';

@Component({
    selector: 'app-cargar-hx',
    templateUrl: './cargar-hx.component.html',
    styleUrls: ['./cargar-hx.component.css']
})
export class CargarHXComponent implements OnInit {


    fileHx: any;
    fileBlob: any;
    listadoTipoPlanilla: Array<any>;
    listadoPrograPla: Array<any>;
    listadoPlanta = [{ label: "NINGUNA", valor: 0 }];
    selectedPlanta: any;
    archivoHXObjecto: ArchivoHX;
    listadoHX: Array<any>;

    keyword = 'nomTipopla';
    keywordPla = 'stringProgramacionPla';
    habilitarUpload: boolean = true;


    constructor(private servicioRRhhEmpApi: PlanillaService) {



        this.archivoHXObjecto = new ArchivoHX();

        servicioRRhhEmpApi.obtenerTiposPlanilla(3, 2).subscribe(
            data => {
                this.listadoTipoPlanilla = data;
                //  console.log('Datos que vienen:'+JSON.stringify(data));
            }
        );

    }

    ngOnInit(): void {
        this.servicioRRhhEmpApi.logueado=true;
    }


    selectEvent(item) {
        // console.log('Lo que selecciono'+JSON.stringify(item));

        this.servicioRRhhEmpApi.obtenerProgramacionCloser(item.tiposPlanillaPK.codCia, item.tiposPlanillaPK.codTipopla).subscribe(
            prograPla => {
                /// console.log('cambios'+JSON.stringify(prograPla));
                this.listadoPrograPla = prograPla;
            }
        );

    }

    deleteEvent(item) {
        console.log('Lo que elimino' + JSON.stringify(item));
    }


    selectProgramacionPlaEvent(item) {
        this.habilitarUpload = false;
        console.log('Hola' + JSON.stringify(item));
        this.archivoHXObjecto.programacionPla = new ProgramacionPla();
        this.archivoHXObjecto.programacionPla = item;
        this.llenarHXCargar(this.archivoHXObjecto.programacionPla);

    }


    actualizarLista(){
        this.listadoHX =[];
        this.servicioRRhhEmpApi.obtenerHorasExtrasLista(3, this.archivoHXObjecto?.programacionPla?.anio, this.archivoHXObjecto?.programacionPla?.mes,
            this.archivoHXObjecto?.programacionPla?.tiposPlanilla?.tiposPlanillaPK?.codTipopla, this.archivoHXObjecto?.programacionPla?.numPlanilla).subscribe(
                data => {
                    this.listadoHX = data;
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
                // console.log(dataArray[1]);
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



    consumirHorasExtras(base64: any) {
        this.archivoHXObjecto.archivo = base64;
        this.archivoHXObjecto.planta = null;
        this.archivoHXObjecto.username = 'RH_HUMANOS.3';
        this.archivoHXObjecto.codEmpleadoSesion = 47;

        console.log('Archivos to API:' + JSON.stringify(this.archivoHXObjecto));


        this.servicioRRhhEmpApi.cargarHX(this.archivoHXObjecto).subscribe(
            archive => {
                //console.log('RESPUESTA TO API'+JSON.stringify(archive));
                this.actualizarLista();

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



    llenarHXCargar(objeto: ProgramacionPla) {

        this.servicioRRhhEmpApi.obtenerHorasExtrasLista(3, objeto.anio, objeto.mes,
            objeto.tiposPlanilla.tiposPlanillaPK.codTipopla, objeto.numPlanilla).subscribe(
                data => {
                    this.listadoHX = data;
                }
            );

    }

}

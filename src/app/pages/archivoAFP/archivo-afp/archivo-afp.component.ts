import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { PlanillaService } from '../../servicio/planilla.service';
import { RequestArchivoAFP } from '../modelo/RequestArchivoAFP';

@Component({
    selector: 'app-archivo-afp',
    templateUrl: './archivo-afp.component.html',
    styleUrls: ['./archivo-afp.component.css']
})
export class ArchivoAfpComponent implements OnInit {

    generarIsss: boolean = false;
    listaPlanilla: Array<any>;
    listaPlanillaAdded: Array<any> = [];
    afpForm: FormGroup;
    p: number = 1;

    constructor(private servicio: PlanillaService, private fb: FormBuilder) {
        this.servicio.logueado = true;
    }

    ngOnInit(): void {
        this.createFormAFP();
    }

    createFormAFP() {
        this.afpForm = this.fb.group({
            anio: [, Validators.required],
            mes: [, Validators.required]
        });
    }

    buscarPlanillas(): void {

        this.servicio.obtenerPlanillas(Number(this.afpForm.get('mes').value), Number(this.afpForm.get('anio').value))
            .subscribe(data => this.listaPlanilla = data);
    }


    seleccionarPlanilla(values: any, objeto: any) {

        if (values.currentTarget.checked) {
            this.listaPlanillaAdded.push(objeto);
        } else {
            var indice = this.listaPlanillaAdded.indexOf(objeto);
            this.listaPlanillaAdded.splice(indice, 1);
        }
    }


    generarAFP() {


        if (this.generarIsss) {
            if (this.listaPlanillaAdded?.length > 0) {
                let objetoArrayAFP: RequestArchivoAFP = new RequestArchivoAFP();
                objetoArrayAFP.anio = Number(this.afpForm.get('anio').value);
                objetoArrayAFP.mes = Number(this.afpForm.get('mes').value);
                objetoArrayAFP.empresa = 3;
                objetoArrayAFP.programaciones = this.listaPlanillaAdded;
                this.servicio.generarArchivoAFP(objetoArrayAFP).subscribe(gen => {
                    console.log("RESPUESTA GEN ARCHIVO" + JSON.stringify(gen));
                    this.downloadBase64File('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', gen.archivo, 'Planilla_AFP');

                });

            } else {
                Swal.fire('Seleccione item, por favor');
            }
        } else {
            if (this.listaPlanillaAdded?.length > 0) {
                let objetoArrayAFP: RequestArchivoAFP = new RequestArchivoAFP();
                objetoArrayAFP.anio = Number(this.afpForm.get('anio').value);
                objetoArrayAFP.mes = Number(this.afpForm.get('mes').value);
                objetoArrayAFP.empresa = 3;
                objetoArrayAFP.programaciones = this.listaPlanillaAdded;
                this.servicio.generarArchivoISSS(objetoArrayAFP).subscribe(gen => {
                    console.log("RESPUESTA GEN ARCHIVO" + JSON.stringify(gen));
                    this.downloadBase64File('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', gen.archivo, 'Planilla_ISSS');

                });

            } else {
                Swal.fire('Seleccione item, por favor');
            }
        }

    }


    downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }


    cambiarArchivo($event) {
        this.listaPlanillaAdded=[];
        this.listaPlanilla=[];
        let valor: boolean = $event;
        this.generarIsss = valor;
        console.log('event::' + $event);
    }


}

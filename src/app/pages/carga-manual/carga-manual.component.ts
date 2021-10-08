import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { ProgramacionPla } from "../formPlanilla/form-planilla/modeloPlanilla/ProgramacionPla";
import { Empleado } from "../modelo/Empleado";
import { FormEmpleadoModel } from "../modelo/formEmpleadoModel";
import { PlanillaService } from "../servicio/planilla.service";
import { CargaManualDp } from "./modelo/CargaManualDp";

@Component({
    selector: 'carga-manual',
    templateUrl: './carga-manual.component.html',
    styleUrls: ['./carga-manual.component.css']
})

export class CargaManualComponent implements OnInit {

    ver: boolean = true;
    listaEmpleados: Array<any>;
    p: number = 1;
    formEmpleado: FormGroup;
    empleadoSeleccion = new Empleado();
    prestacionOjb: any;
    deduccionObj: any;
    listadoDeducciones: Array<any>;
    listaPrestaciones: Array<any>;
    cargaManualRequest = new CargaManualDp();
    pdf: any;
    pdfAdjuntado: any;
    habilitarGuardado: boolean = true;
    cargaManualForm: FormGroup;
    listaHistoricoMovDp: Array<any>;
    @ViewChild('iframe', { static: true }) iframe: ElementRef;
    urlDescarga: any;




    constructor(private router: Router, private servicioRRHH: PlanillaService, private fb: FormBuilder, private domSanitizer: DomSanitizer) {
        const objeto = {
            empresa: 3,
            estado:true
        };

        //console.log('Planilla Seleccionada' + JSON.stringify(this.servicioRRHH.objetoPlanillaServicio));
        this.obtenerMovDp(this.servicioRRHH.objetoPlanillaServicio);
        this.pdf = this.domSanitizer.bypassSecurityTrustResourceUrl('');
        this.pdfAdjuntado = this.domSanitizer.bypassSecurityTrustResourceUrl('');

        this.servicioRRHH.obtenerDeduccion(3, "S").subscribe(prestacion => this.listaPrestaciones = prestacion);
        this.servicioRRHH.obtenerDeduccion(3, "R").subscribe(deduccion => this.listadoDeducciones = deduccion);

        this.servicioRRHH.obtenerEmpleados(objeto).subscribe(
            data => {
                this.listaEmpleados = data;
                //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
            }
        );


        this.createForm();
        this.createFormulario()


    }

    ngOnInit(): void {
        this.servicioRRHH.logueado = true;
    }


    createFormulario() {
        this.cargaManualForm = this.fb.group({
            valor: ['',],
            nombre: ['',],
            descripcion: ['',],
            anio: ['',],
        });
    }


    createForm() {
        this.formEmpleado = this.fb.group({
            codEmp: ['',],
            nombre: ['',],
            numDui: ['',],
        });
    }



    llenarEmpleado(valor: any) {
        this.empleadoSeleccion = valor;
        this.cargaManualRequest.empleado = this.empleadoSeleccion;
    }


    Buscar() {


        let formEmpleado = new FormEmpleadoModel();

        formEmpleado.empresa = 3;
        formEmpleado.estado=true;

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

        this.servicioRRHH.obtenerEmpleados(formEmpleado).subscribe(
            data => {
                this.listaEmpleados = data;
            }
        );


    }

    limpiar() {

        this.formEmpleado.reset();
        const objeto = {
            empresa: 3,
            estado:true
        }

        this.listaEmpleados = [];

        this.servicioRRHH.obtenerEmpleados(objeto).subscribe(
            data => {
                this.listaEmpleados = data;
            }
        );
    }



    asignarPrestaciones(item: any) {
        this.deduccionObj = null;
        this.prestacionOjb = item;
        this.cargaManualRequest.deducPresta = item;
    }

    asignarDeduccion(item: any) {
        this.prestacionOjb = null;
        this.deduccionObj = item;
        this.cargaManualRequest.deducPresta = item;
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
                this.obtenerBase64(dataArray[1]);
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

    obtenerBase64(data: any) {
        this.habilitarGuardado = false;
        this.cargaManualRequest.archivo = data;
        this.pdf = this.visualizarBase64(data);

        // console.log('Lo que mando al api Carga Manual' + JSON.stringify(this.cargaManualRequest));
    }




    visualizarBase64(dataArchivo: any) {
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
        }

        const contentType = 'application/pdf';
        let b64Data = String(dataArchivo).replace("data:application/pdf;base64,", "");
        ////console.log('La data que llega al visor de pdf:' + b64Data);

        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        return this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);

    }



    visualizarBase64Carga(dataArchivo: any) {
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
        }

        const contentType = 'application/pdf';
        let b64Data = String(dataArchivo).replace("data:application/pdf;base64,", "");
        ////console.log('La data que llega al visor de pdf:' + b64Data);

        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        this.pdfAdjuntado = '';
        this.pdfAdjuntado = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);

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
        }

        const contentType = 'application/pdf';
        let b64Data = String(dataArchivo).replace("data:application/pdf;base64,", "");
        ////console.log('La data que llega al visor de pdf:' + b64Data);

        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
        this.urlDescarga = '';
        this.urlDescarga = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);

    }





    guardar() {
        this.cargaManualRequest.programacionPla = this.servicioRRHH.objetoPlanillaServicio;
        if (this.cargaManualForm.get('descripcion').value) {
            this.cargaManualRequest.observacion = String(this.cargaManualForm.get('descripcion').value);
        }


        if (this.cargaManualForm.get('valor').value) {
            this.cargaManualRequest.valor = Number(this.cargaManualForm.get('valor').value);
        }


        console.log('Lo que mando al Api del carga manual' + JSON.stringify( this.cargaManualRequest));
        this.servicioRRHH.guardarCargaManualDeduc(this.cargaManualRequest).subscribe(resp => {


            Swal.fire({
                title: 'Datos Guardados Con Exito!',
                text: "",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigateByUrl('planilla')
                }
            })


            console.log('json de la carga manual:' + JSON.stringify(resp))

        });
    }


    verFormulario() {
        this.ver = !this.ver;

    }


    obtenerMovDp(data: ProgramacionPla) {

        if (data) {

            this.servicioRRHH.obtenerMovDp(data.programacionPlaPK.codCia,
                data.programacionPlaPK.codTipopla,
                data.anio,
                data.mes,
                data.numPlanilla
            ).subscribe(data => this.listaHistoricoMovDp = data);
        }

    }




    verAdjunto(base: any) {

        this.visualizarBase64Carga(base);

        //console.log('this.pdfAdjuntado'+JSON.stringify(base));

    }

    descargar(data) {
        this.visualizarBase64URL(data);
        //window.open(this.urlDescarga);
    }


}

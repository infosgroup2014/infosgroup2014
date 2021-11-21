import { Component, OnInit } from '@angular/core';
import { ReclutamientoService } from './../../servicio/reclutamiento.service';
import { PlanillaService } from './../../servicio/planilla.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { DocumentosCandidato } from './modelo/documentosCandidato';
import { DocumentosCandidatoPK } from './modelo/documentosCandidatoPK';
import Swal from "sweetalert2";
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-expediente-digital-candidato',
  templateUrl: './expediente-digital-candidato.component.html',
  styleUrls: ['./expediente-digital-candidato.component.scss']
})
export class ExpedienteDigitalCandidatoComponent implements OnInit {

  documentosCandidatoForm: FormGroup;
  cargoDoc: boolean = false;

  urlFoto: any;


  validationMessages = {
    'descripcion': {
      'required': 'el campo requerido.'
    }

  };

  formErrors = {
    'descripcion': ''
  };

  listaDocumentosCandidato: DocumentosCandidato[] = [];
  DocCandidatoSelec: DocumentosCandidatoPK = new DocumentosCandidatoPK;
  DocCandidatoSelecData: DocumentosCandidato = new DocumentosCandidato;

  listadoDocumentos: Array<any>;

  constructor(
    private _router: Router,
    private router: ActivatedRoute,
    private servicioPlanilla: PlanillaService,
    private reclutamientoService: ReclutamientoService,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer
  ) {

    this.router.paramMap.subscribe(params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodCandidato = +params.get('codCandidato');
      console.log('Candidato:' + CodCia + '-' + CodCandidato);
      this.DocCandidatoSelec.codCia = CodCia;
      this.DocCandidatoSelec.codCandidato = CodCandidato;

    });

    this.obtenerDatos(this.DocCandidatoSelec.codCia, this.DocCandidatoSelec.codCandidato);

  }


  ngOnInit(): void {

    this.servicioPlanilla.logueado = true;

    this.documentosCandidatoForm = this.fb.group({
      codCia: [''],
      codCandidato: [''],
      codArchivo: [''],
      folio: [''],
      descripcion: ['', Validators.required],
      extension: [''],
      fechaCargo: [''],
      ruta: [''],
      tipo: [''],
      nombre: ['']
    });

  }

  logValidationErrors(group: FormGroup = this.documentosCandidatoForm): void {

    Object.keys(group.controls).forEach((key: string) => {

      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        console.log('Validaciones...')
        console.log(messages);
        console.log(abstractControl.errors);
        console.log(this.documentosCandidatoForm)
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

  obtenerDatos(cia: number, emp: number) {

    this.reclutamientoService.obtenerListaTipoDocumento(cia).subscribe(
      tDocumentos => {
        this.listadoDocumentos = tDocumentos;
        console.log("datos que trae del catalogo " + this.listadoDocumentos)
      }
    );


    this.reclutamientoService.obtenerDocumentosCandidato(cia, emp).subscribe(
      tDocumentos => {
        this.listaDocumentosCandidato = tDocumentos;
        console.log("datos que trae por candidato " + this.listadoDocumentos)
      }
    );



  }

  agregarDocumentosCandidato() {
    console.log('agregar preparacion');

    console.log(this.documentosCandidatoForm);


    let documentos: DocumentosCandidato = new DocumentosCandidato();
    documentos.documentosCandidatoPK = new DocumentosCandidatoPK();


    documentos.documentosCandidatoPK.codCia = this.DocCandidatoSelec.codCia;
    documentos.documentosCandidatoPK.codCandidato = this.DocCandidatoSelec.codCandidato;
    documentos.descripcion = this.documentosCandidatoForm.get('descripcion').value;
    
    /*


    preparacion.nomInstitucion = this.preparacionAcademicaCForm.get('nomInstitucion').value;
    preparacion.codPais = this.preparacionAcademicaCForm.get('codPais').value;
    preparacion.codDepto = this.preparacionAcademicaCForm.get('codDepto').value;
    preparacion.subNivel = this.preparacionAcademicaCForm.get('subNivel').value;
    preparacion.anioIngreso = this.preparacionAcademicaCForm.get('anioIngreso').value;
    preparacion.anioEgreso = this.preparacionAcademicaCForm.get('anioEgreso').value;*/
    




    this.reclutamientoService.guardarDocumentos(documentos).subscribe(
      datos => {
        if (datos.documentosCandidatoPK.codArchivo) {


          Swal.fire('Guardar Preparacion Academica',
            'Datos Guardados con exito!',
            'success');

          this.limpiar();


        } else {
          Swal.fire('Guardar Preparacion Academica',
            'Error al Guardar',
            'error');
        }
      }
    );



  }


  eliminarDocumentos(DocumentosIcndex: DocumentosCandidatoPK): void {
    this.reclutamientoService.eliminarDocumentos(
      DocumentosIcndex
    ).subscribe(res => {
      Swal.fire('Eliminar Docuemntos candidato',
        'Se elimino el registro con exito!',
        'success');
      this.limpiar();
    });


  }

  verDocumentos(DocumentosIcndex: DocumentosCandidatoPK): void {
   /* this.reclutamientoService.eliminarDocumentos(
      DocumentosIcndex
    ).subscribe(res => {
      Swal.fire('Eliminar Docuemntos candidato',
        'Se elimino el registro con exito!',
        'success');
      this.limpiar();
    });*/
    Swal.fire('Ver Docuemntos candidato',
        'Ver el registro con exito!',
        'success');
    this.limpiar();

  }

  descargarDocumentos(DocumentosIcndex: DocumentosCandidatoPK): void {
   /* this.reclutamientoService.eliminarDocumentos(
      DocumentosIcndex
    ).subscribe(res => {
      Swal.fire('Eliminar Docuemntos candidato',
        'Se elimino el registro con exito!',
        'success');
      this.limpiar();
    });*/

    Swal.fire('Descargar Docuemntos candidato',
    'Descargar el registro con exito!',
    'success');
this.limpiar();


  }


  limpiar() {
    this.documentosCandidatoForm.reset();

    this.listaDocumentosCandidato = [];

    this.reclutamientoService.obtenerDocumentosCandidato(this.DocCandidatoSelec.codCia, this.DocCandidatoSelec.codCandidato).subscribe((data) => {
      // console.log(JSON.stringify(dat));
      this.listaDocumentosCandidato = data;

    });

  }


  regresoCandidato() {
    //    this.router.navigate(['/pages/capacitaciones', codCia, codEmp]);
    this._router.navigate(['/pages/preparacion-academica-candidato-editado', this.DocCandidatoSelec.codCia,
      this.DocCandidatoSelec.codCandidato]);
  }


  public cargarDocumento(event) {
    let  delims:string="/";
    this.cargoDoc = true;
    const file = event.target.files[0];
    const reader = new FileReader();
    const obtieneTipo:string[]=String(file.type).split(delims);
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result);
        let archivo: any = reader.result;
        console.log(file);
        console.log(obtieneTipo[1]);

        this.documentosCandidatoForm.setValue({
          tipo: obtieneTipo
        });

        this.visualizarBase64URL(archivo);
    };
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

  this.DocCandidatoSelecData.ruta = b64Data;
  //  window.open(blobUrl);
  this.urlFoto = '';
  this.urlFoto = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
}




}

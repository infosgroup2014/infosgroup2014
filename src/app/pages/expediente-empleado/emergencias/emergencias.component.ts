import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  EmailValidator,
  FormArray,
} from "@angular/forms";
import { max } from "rxjs/operators";

import { ActivatedRoute, Router } from "@angular/router";
import { AcademicaService } from "../../servicio/prepAcademica.service";
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { CustomDateParserFormatter } from "../../candidato/form-candidato/modelo/FormatFecha";
import Swal from "sweetalert2";
import { EmergenciaEmp } from "../modelo/EmergenciaEmp";
import { Emergencias, emergenciaXEmpPK } from "../modelo/Emergencias";
import { TheadTitlesRowComponent } from "ng2-smart-table/lib/components/thead/rows/thead-titles-row.component";

@Component({
  selector: "app-emergencias",
  templateUrl: "./emergencias.component.html",
  styleUrls: ["./emergencias.component.css"],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class EmergenciasComponent implements OnInit {
  listaEmergencias = [];
  listaParentescos = [];

  listaCondicionSalud = [
    { label: "Buena", valor: "B" },
    { label: "Regular", valor: "R" },
    { label: "Mala", valor: "M" },
  ];

  EmpleadoSelec: emergenciaXEmpPK = new emergenciaXEmpPK();

  emergenciaForm: FormGroup;

  datosEmergenciaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private _router: Router,
    private serviciosExpediente: AcademicaService
  ) {
    this.router.paramMap.subscribe((params) => {
      console.log("Parametros que llegan.");
      console.log(params);
      const CodCia = +params.get("codCia");
      const CodEmp = +params.get("codEmp");
      console.log("Empleado:" + CodCia + "-" + CodEmp);
      this.EmpleadoSelec.codCia = CodCia;
      this.EmpleadoSelec.codEmp = CodEmp;
      //        console.log('Empselect:'+this.EmpleadoSelec.codCia);

      this.serviciosExpediente
        .obtenerEmergecias(CodCia, CodEmp)
        .subscribe((data) => {
          console.log("regreso del servicio");
          console.log(data);
          this.listaEmergencias = data;
          console.log(this.listaEmergencias);
          //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
        });

      this.serviciosExpediente
        .obtenerDatosEmergencia(CodCia, CodEmp)
        .subscribe((data) => {
          console.log("regreso del servicio datos emergencia");
          console.log(data);
          console.log("------------------------");

          this.datosEmergenciaForm.patchValue({
            actividadLimitada: data.actividadLimitada,
            condicionSalud: data.condicionSalud,
            esAlergico: data.esAlergico,
            estatura: data.estatura,
            frecuenciaConsumoBebidas: data.frecuenciaConsumoBebidas,
            fuma: data.fuma,
            medicina: data.medicina,
            nombreConyuge: data.nombreConyuge,
            padecimientos: data.padecimientos,
            peso: data.peso,
            telefonoConyuge: data.telefonoConyuge,
            tieneAccidente: data.tieneAccidente,
            tieneSeguroVida: data.tieneSeguroVida,
            tipoAccidente: data.tipoAccidente,
            trabajoConyuge: data.trabajoConyuge,
            padeceAlergia: data.padecimientos?.substring(
              data.padecimientos.search("A"),
              data.padecimientos.search("A") + 1
            ),
            padeceVista: data.padecimientos?.substring(
              data.padecimientos.search("V"),
              data.padecimientos.search("V") + 1
            ),
            padeceOidos: data.padecimientos?.substring(
              data.padecimientos.search("O"),
              data.padecimientos.search("O") + 1
            ),
            padeceEpilepsias: data.padecimientos?.substring(
              data.padecimientos.search("E"),
              data.padecimientos.search("E") + 1
            ),
            padeceNervios: data.padecimientos?.substring(
              data.padecimientos.search("S"),
              data.padecimientos.search("S") + 1
            ),
          });

          if (this.datosEmergenciaForm.get("actividadLimitada").value != "S") {
            this.datosEmergenciaForm.get("actividadLimitada").setValue("");
          }

          if (this.datosEmergenciaForm.get("tieneAccidente").value != "S") {
            this.datosEmergenciaForm.get("tieneAccidente").setValue("");
          }

          if (this.datosEmergenciaForm.get("padeceAlergia").value != "A") {
            this.datosEmergenciaForm.get("padeceAlergia").setValue("");
          }

          if (this.datosEmergenciaForm.get("padeceVista").value != "V") {
            this.datosEmergenciaForm.get("padeceVista").setValue("");
          }

          if (this.datosEmergenciaForm.get("padeceOidos").value != "O") {
            this.datosEmergenciaForm.get("padeceOidos").setValue("");
          }

          if (this.datosEmergenciaForm.get("padeceEpilepsias").value != "E") {
            this.datosEmergenciaForm.get("padeceEpilepsias").setValue("");
          }

          if (this.datosEmergenciaForm.get("padeceNervios").value != "S") {
            this.datosEmergenciaForm.get("padeceNervios").setValue("");
          }

          //          this.datosEmergenciaForm.get('padeceEpilepsias').setValue('-');

          console.log("Datos de Emergencia del Empleado");
          console.log(this.datosEmergenciaForm);

          // console.log('tiene alergia');
          // console.log('es alergico:'+this.datosEmergenciaForm.get('padecimientos').value.substring(
          //            this.datosEmergenciaForm.get('padecimientos').value.search('A'),
          //            this.datosEmergenciaForm.get('padecimientos').value.search('A')+1
          //            ));
          // console.log('primera pos:'+ this.datosEmergenciaForm.get('padecimientos').value.substring(
          //           4,
          //             5
          //             ));
          // console.log('si hay o:'+this.datosEmergenciaForm.get('padecimientos').value.search('O'));
        });
    });
  }

  validationMessages: { [x: string]: any } = {
    codParentesco: {
      required: "El campo es requerido",
    },
    nombre: {
      required: "El campo es requerido",
    },
    telefono: {
      required: "El campo es requerido",
    },
  };

  validationMessagesE: { [x: string]: any } = {
    nombreConyuge: {
      required: "El campo es requerido",
    },
    telefonoConyuge: {
      required: "El campo es requerido",
    },
    esAlergico: {
      required: "El campo es requerido",
    },
  };

  formErrors: { [x: string]: any } = {
    codParentesco: "",
    nombre: "",
    telefono: "",
  };

  formErrorsE: { [x: string]: any } = {
    nombreConyuge: "",
    telefonoConyuge: "",
    esAlergico: "",
  };

  ngOnInit(): void {
    this.emergenciaForm = this.fb.group({
      codCia: [""],
      codEmp: [""],
      codParentesco: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      telefono: ["", [Validators.required]],
    });

    this.datosEmergenciaForm = this.fb.group({
      actividadLimitada: [""],
      condicionSalud: [""],
      esAlergico: [""],
      estatura: [""],
      frecuenciaConsumoBebidas: [""],
      fuma: [""],
      medicina: [""],
      nombreConyuge: [""],
      padecimientos: [""],
      peso: [""],
      telefonoConyuge: [""],
      tieneAccidente: [""],
      tieneSeguroVida: [""],
      tipoAccidente: [""],
      trabajoConyuge: [""],
      padeceAlergia: [""],
      padeceVista: [""],
      padeceOidos: [""],
      padeceEpilepsias: [""],
      padeceNervios: [""],
    });

    this.serviciosExpediente
      .obtenerParentesco(this.EmpleadoSelec.codCia)
      .subscribe((data) => {
        console.log("regreso los parentescos");
        console.log(data);
        this.listaParentescos = data;
      });
  }

  regresoexpediente() {
    //    this.router.navigate(['/pages/equipoes', codCia, codEmp]);
    this._router.navigate([
      "/pages/expediente_editado",
      this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp,
    ]);
  }

  logValidationError(group: FormGroup = this.emergenciaForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        for (const errorKey in abstractControl.errors) {
          const messages = this.validationMessages[key];

          console.log(key + ":" + errorKey);
          this.formErrors[key] += messages[errorKey] + " ";
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationError(control);
          }
        }
      }
    });
  }

  logValidationErrorE(group: FormGroup = this.datosEmergenciaForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        for (const errorKey in abstractControl.errors) {
          const messages = this.validationMessagesE[key];

          console.log(key + ":" + errorKey);
          this.formErrorsE[key] += messages[errorKey] + " ";
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }

      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationError(control);
          }
        }
      }
    });
  }

  agregarEmergencia() {
    console.log("agregar equipo");

    console.log(this.emergenciaForm);

    let temergencia: Emergencias = new Emergencias();
    temergencia.emergenciaXEmpPK = new emergenciaXEmpPK();

    temergencia.emergenciaXEmpPK.codCia = this.EmpleadoSelec.codCia;
    temergencia.emergenciaXEmpPK.codEmp = this.EmpleadoSelec.codEmp;
    //temergencia.emergenciaXEmpPK.=   this.emergenciaForm.get('codEquipo').value;

    temergencia.nombre = this.emergenciaForm.get("nombre").value;
    temergencia.telefono = this.emergenciaForm.get("telefono").value;
    temergencia.codParentesco = this.emergenciaForm.get("codParentesco").value;

    this.serviciosExpediente
      .guardarEmergencia(temergencia)
      .subscribe((datos) => {
        if (datos.emergenciaXEmpPK.codEmergencia) {
          Swal.fire(
            "Guardar Emergencia",
            "Datos Guardados con exito!",
            "success"
          );

          this.limpiar();
        } else {
          Swal.fire("Guardar Emergencia", "Error al Guardar", "error");
        }
      });
  }

  limpiar() {
    this.emergenciaForm.reset();

    this.listaEmergencias = [];

    this.serviciosExpediente
      .obtenerEmergecias(this.EmpleadoSelec.codCia, this.EmpleadoSelec.codEmp)
      .subscribe((data) => {
        console.log("regreso del servicio");
        console.log(data);
        this.listaEmergencias = data;
        console.log(this.listaEmergencias);
        //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
      });
  }

  eliminarEmergencia(emergenciaIcndex: emergenciaXEmpPK): void {
    this.serviciosExpediente
      .eliminarEmergencia(emergenciaIcndex)
      .subscribe((res) => {
        this.limpiar();
      });
  }

  actualizoDatosEmergencia() {
    console.log("guardar cambios de emergencia");
    console.log(this.datosEmergenciaForm);

    let emergenciaEmp: EmergenciaEmp = new EmergenciaEmp();

    emergenciaEmp.nombreConyuge =
      this.datosEmergenciaForm.get("nombreConyuge").value;
    emergenciaEmp.trabajoConyuge =
      this.datosEmergenciaForm.get("trabajoConyuge").value;
    emergenciaEmp.telefonoConyuge =
      this.datosEmergenciaForm.get("telefonoConyuge").value;
    emergenciaEmp.peso = this.datosEmergenciaForm.get("peso").value;
    emergenciaEmp.estatura = this.datosEmergenciaForm.get("estatura").value;

    if (
      this.datosEmergenciaForm.get("actividadLimitada").value ||
      this.datosEmergenciaForm.get("actividadLimitada").value == "S"
    ) {
      emergenciaEmp.actividadLimitada = "S";
    } else {
      emergenciaEmp.actividadLimitada = "N";
    }
    if (
      this.datosEmergenciaForm.get("tieneAccidente").value ||
      this.datosEmergenciaForm.get("tieneAccidente").value == "S"
    ) {
      emergenciaEmp.tieneAccidente = "S";
    } else {
      emergenciaEmp.tieneAccidente = "N";
    }

    emergenciaEmp.tipoAccidente =
    this.datosEmergenciaForm.get("tipoAccidente").value;

    emergenciaEmp.condicionSalud =
      this.datosEmergenciaForm.get("condicionSalud").value;
    emergenciaEmp.esAlergico = this.datosEmergenciaForm.get("esAlergico").value;
    emergenciaEmp.frecuenciaConsumoBebidas = this.datosEmergenciaForm.get(
      "frecuenciaConsumoBebidas"
    ).value;
    emergenciaEmp.fuma = this.datosEmergenciaForm.get("fuma").value;
    emergenciaEmp.medicina = this.datosEmergenciaForm.get("medicina").value;

    emergenciaEmp.padecimientos = "";
    if (
      this.datosEmergenciaForm.get("padeceAlergia").value == "A" ||
      this.datosEmergenciaForm.get("padeceAlergia").value
    ) {
      emergenciaEmp.padecimientos += "A,";
      //        this.datosEmergenciaForm.get("padeceAlergia").value+',';
    }

    if (
      this.datosEmergenciaForm.get("padeceVista").value == "V" ||
      this.datosEmergenciaForm.get("padeceVista").value
    ) {
      emergenciaEmp.padecimientos += "V,";
      //        this.datosEmergenciaForm.get("padeceVista").value+',';
    }

    if (
      this.datosEmergenciaForm.get("padeceOidos").value == "O" ||
      this.datosEmergenciaForm.get("padeceOidos").value
    ) {
      emergenciaEmp.padecimientos += "O,";
      //        this.datosEmergenciaForm.get("padeceOidos").value+',';
    }

    if (
      this.datosEmergenciaForm.get("padeceEpilepsias").value == "E" ||
      this.datosEmergenciaForm.get("padeceEpilepsias").value
    ) {
      emergenciaEmp.padecimientos += "E,";
      //        this.datosEmergenciaForm.get("padeceEpilepsias").value+',';
    }

    if (
      this.datosEmergenciaForm.get("padeceNervios").value == "S" ||
      this.datosEmergenciaForm.get("padeceNervios").value
    ) {
      emergenciaEmp.padecimientos += "S,";
      //        this.datosEmergenciaForm.get("padeceNervios").value+',';
    }

    emergenciaEmp.tieneSeguroVida =
      this.datosEmergenciaForm.get("tieneSeguroVida").value;
    // emergenciaEmp.tipoAccidente =
    //   this.datosEmergenciaForm.get("tipoAccidente").value;

    console.log("Llego a actualizar datos de emergencia.");
    console.log(emergenciaEmp);

    this.serviciosExpediente
      .updateDatosEmergencia(
        this.EmpleadoSelec.codCia,
        this.EmpleadoSelec.codEmp,
        emergenciaEmp
      )
      .subscribe((datos) => {
        if (datos) {
          Swal.fire(
            "Guardar Datos de Emergencia",
            "Datos Guardados con exito!",
            "success"
          );

          this.limpiar();
        } else {
          Swal.fire("Guardar Datos de Emergencia", "Error al Guardar", "error");
        }
      });

    //this.limpiar;
    this._router.navigate([
      "/pages/expediente_editado",
      this.EmpleadoSelec.codCia,
      this.EmpleadoSelec.codEmp,
    ]);
  }

  checkValue(event: any) {
    console.log(event);
  }
}

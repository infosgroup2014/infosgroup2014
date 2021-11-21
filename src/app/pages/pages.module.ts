import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PlanillaComponent } from './planilla/planilla.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditarPlanillaComponent } from './planilla/editar-planilla/editar-planilla.component';
import { FormPlanillaComponent } from './formPlanilla/form-planilla/form-planilla.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoComponent } from './candidato/form-candidato/candidato-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContratacionDirectaComponent } from './contratacion-directa/contratacion-directa.component';
import { ExpedienteEmpleadoComponent } from './expediente-empleado/expediente-empleado.component';
import { ArchivoAfpComponent } from './archivoAFP/archivo-afp/archivo-afp.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AccionCrearComponent } from './accion-personal/accion-crear.component';
import { AccionNoAfectaPlanillaComponent } from './accion-personal/accion-no-afecta-planilla.component';
import { AccionPersonalComponent } from './accion-personal/accion-personal.component';
import { CargaManualComponent } from './carga-manual/carga-manual.component';
import { DeduccionesComponent } from './deduccion/deducciones.component';
import { CargarHXComponent } from './cargar-hx/cargar-hx.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { LoginComponent } from './login/login.component';
import { PlantillaDosComponent } from './plantilla-dos/plantilla-dos.component';
import { PlantillaTresComponent } from './plantilla-tres/plantilla-tres.component';
import { PlantillaSieteComponent } from './plantilla-siete/plantilla-siete.component';
import { PlantillaCuatroComponent } from './plantilla-cuatro/plantilla-cuatro.component';
import { PlantillaSeisComponent } from './plantilla-seis/plantilla-seis.component';
import { PlantillaCincoComponent } from './plantilla-cinco/plantilla-cinco.component';
import { BeneficiarioComponent } from './expediente-empleado/beneficiario/beneficiario.component';
import { CapacitacionesComponent } from './expediente-empleado/capacitaciones/capacitaciones.component';
import { DependientesComponent } from './expediente-empleado/dependientes/dependientes.component';
import { ExperienciaLaboralComponent } from './expediente-empleado/experiencia-laboral/experiencia-laboral.component';
import { EnviarBoletasComponent } from './planilla/enviar-boletas/enviar-boletas.component';
import { ProgramarDeduccionesComponent } from './planilla/programar-deducciones/programar-deducciones.component';
import { EquipoOficinaComponent } from './expediente-empleado/equipo-oficina/equipo-oficina.component';
import { ReferenciasComponent } from './expediente-empleado/referencias/referencias.component';
import { PreparacionAcademicaComponent } from './expediente-empleado/preparacion-academica/preparacion-academica.component';
import { IdiomasComponent } from './expediente-empleado/idiomas/idiomas.component';
import { PruebasComponent } from './expediente-empleado/pruebas/pruebas.component';
import { PreparacionAcademicaCanComponent } from './candidato/preparacion-academica/preparacion-academica.component';
import { ExpedienteDigitalCandidatoComponent } from './candidato/expediente-digital-candidato/expediente-digital-candidato.component';
+import { EmergenciasComponent } from './expediente-empleado/emergencias/emergencias.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NgxPaginationModule,
    NgSelectModule,AutocompleteLibModule,
    NgbModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#00ACFF',
      defaultBoColor : '#476EFF',
      checkedLabel: 'on',
      uncheckedLabel: 'off'
    })
  ],

  declarations: [LoginComponent,
    PagesComponent,
    PlanillaComponent,
    EditarPlanillaComponent,
    FormPlanillaComponent,
    CandidatoComponent,
    CapacitacionesComponent,
    DependientesComponent,
    ExperienciaLaboralComponent,
    EquipoOficinaComponent,
    ReferenciasComponent,
    ContratacionDirectaComponent,
    ExpedienteEmpleadoComponent,
    BeneficiarioComponent,
    PreparacionAcademicaComponent,
    IdiomasComponent,
    PruebasComponent,
    EmergenciasComponent,
    ArchivoAfpComponent,
    AccionCrearComponent,
    AccionNoAfectaPlanillaComponent,
    AccionPersonalComponent,
    CargaManualComponent,
    DeduccionesComponent,
    CargarHXComponent,
    PlantillaDosComponent,
    PlantillaTresComponent,
    PlantillaSieteComponent,
    PlantillaCuatroComponent,
    PlantillaSeisComponent,
    PlantillaCincoComponent,
    EnviarBoletasComponent,
    ProgramarDeduccionesComponent,
    PreparacionAcademicaCanComponent,
    ExpedienteDigitalCandidatoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class PagesModule {
}

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ExpedienteEmpleadoComponent } from './expediente-empleado.component';
import { ExpedienteRoutingModule } from './expediente-routing.module';
import { PreparacionAcademicaComponent } from './preparacion-academica/preparacion-academica.component';

import { DependientesComponent } from './dependientes/dependientes.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { BeneficiarioComponent } from './beneficiario/beneficiario.component';
import { PruebasComponent } from './pruebas/pruebas.component';
import { PuestosEntrevistasComponent } from './puestos-entrevistas/puestos-entrevistas.component';
import { DatosAfiliacionComponent } from './datos-afiliacion/datos-afiliacion.component';
import { GeneralesComponent } from './generales/generales.component';
import { ExpedienteDigitalComponent } from './expediente-digital/expediente-digital.component';
import { ExperienciaLaboralComponent } from './experiencia-laboral/experiencia-laboral.component';
import { CapacitacionesComponent } from './capacitaciones/capacitaciones.component';
import { EmergenciasComponent } from './emergencias/emergencias.component';
import { IdiomasComponent } from './idiomas/idiomas.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { EquipoOficinaComponent } from './equipo-oficina/equipo-oficina.component';
import { EquipoTrabajoComponent } from './equipo-trabajo/equipo-trabajo.component';
import { MotivacionProyeccionComponent } from './motivacion-proyeccion/motivacion-proyeccion.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { DatosEconomicosComponent } from './datos-economicos/datos-economicos.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [NgxPaginationModule,NgSelectModule,NgxMaskModule.forRoot(),CommonModule, PageHeaderModule,NgbModule,FormsModule,ReactiveFormsModule,ExpedienteRoutingModule  ,NgxMaskModule.forRoot(),CommonModule, PageHeaderModule,NgbModule,FormsModule,ReactiveFormsModule,ExpedienteRoutingModule],
    declarations: [ExpedienteEmpleadoComponent, CapacitacionesComponent, EmergenciasComponent, IdiomasComponent, DocumentosComponent, EquipoOficinaComponent, EquipoTrabajoComponent, MotivacionProyeccionComponent, ObservacionesComponent, DatosEconomicosComponent,ExpedienteEmpleadoComponent, PreparacionAcademicaComponent, DependientesComponent, ReferenciasComponent, BeneficiarioComponent, PruebasComponent, PuestosEntrevistasComponent, DatosAfiliacionComponent, GeneralesComponent, ExpedienteDigitalComponent, ExperienciaLaboralComponent]
})
export class ExpedienteModule {

}

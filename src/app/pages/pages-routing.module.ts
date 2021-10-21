import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { FormPlanillaComponent } from './formPlanilla/form-planilla/form-planilla.component';
import { CandidatoComponent } from './candidato/form-candidato/candidato-form.component';
import { ContratacionDirectaComponent } from './contratacion-directa/contratacion-directa.component';
import { ExpedienteEmpleadoComponent } from './expediente-empleado/expediente-empleado.component';
import { ArchivoAfpComponent } from './archivoAFP/archivo-afp/archivo-afp.component';
import { AccionPersonalComponent } from './accion-personal/accion-personal.component';
import { AccionCrearComponent } from './accion-personal/accion-crear.component';
import { AccionNoAfectaPlanillaComponent } from './accion-personal/accion-no-afecta-planilla.component';
import { CargaManualComponent } from './carga-manual/carga-manual.component';
import { CargarHXComponent } from './cargar-hx/cargar-hx.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guard/auth.guard';
import { PlantillaDosComponent } from './plantilla-dos/plantilla-dos.component';
import { PlantillaTresComponent } from './plantilla-tres/plantilla-tres.component';
import { PlantillaSieteComponent } from './plantilla-siete/plantilla-siete.component';
import { PlantillaCuatroComponent } from './plantilla-cuatro/plantilla-cuatro.component';
import { PlantillaCincoComponent } from './plantilla-cinco/plantilla-cinco.component';
import { DeduccionesComponent } from './deduccion/deducciones.component';
import { BeneficiarioComponent } from './expediente-empleado/beneficiario/beneficiario.component';
import { CapacitacionesComponent } from './expediente-empleado/capacitaciones/capacitaciones.component';
import { DependientesComponent } from './expediente-empleado/dependientes/dependientes.component';
import { ExperienciaLaboralComponent } from './expediente-empleado/experiencia-laboral/experiencia-laboral.component';
import { ProgramarDeduccionesComponent } from './planilla/programar-deducciones/programar-deducciones.component';
import { EnviarBoletasComponent } from './planilla/enviar-boletas/enviar-boletas.component';
import { EquipoOficinaComponent } from './expediente-empleado/equipo-oficina/equipo-oficina.component';
import { ReferenciasComponent } from './expediente-empleado/referencias/referencias.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'login',
      component: LoginComponent, canActivate: [AuthGuard]
    }
    ,
    {
      path: 'planilla',
      component: PlanillaComponent, canActivate: [AuthGuard]
    },
    {
      path: 'formPlanilla',
      component: FormPlanillaComponent, canActivate: [AuthGuard]
    },{
      path:'candidato',
      component:CandidatoComponent, canActivate: [AuthGuard]
    },
    {
      path:'expediente',
      component:ExpedienteEmpleadoComponent, canActivate: [AuthGuard]
    },
    {
      path:'expediente_editado/:codCia/:codEmp',
      component:ExpedienteEmpleadoComponent, canActivate: [AuthGuard]
    },
    {
      path:'accion-no-afecta-planilla',
      component:AccionNoAfectaPlanillaComponent, canActivate: [AuthGuard]
    },
    {
      path:'plantillaDos',
      component:PlantillaDosComponent, canActivate: [AuthGuard]
    },
    {
      path:'plantillaTres',
      component:PlantillaTresComponent, canActivate: [AuthGuard]
    },
    {
      path:'plantillaCuatro',
      component:PlantillaCuatroComponent, canActivate: [AuthGuard]
    },
    {
      path:'plantillaCinco',
      component:PlantillaCincoComponent, canActivate: [AuthGuard]
    },
    {
      path:'plantillaSiete',
      component:PlantillaSieteComponent, canActivate: [AuthGuard]
    },
    {
      path:'carga-manual',
      component:CargaManualComponent, canActivate: [AuthGuard]
    },
    {
      path:'cargarHX',
      component:CargarHXComponent, canActivate: [AuthGuard]
    },
    {
      path:'deduccion-carga',
      component:DeduccionesComponent, canActivate: [AuthGuard]
    },
    {
      path:'accion-personal-crear',
      component:AccionCrearComponent, canActivate: [AuthGuard]
    },
    {
      path:'accion-personal',
      component:AccionPersonalComponent, canActivate: [AuthGuard]
    },
    {
      path:'archivo',
      component:ArchivoAfpComponent
    },
    {
      path:'contratacion',
      component:ContratacionDirectaComponent, canActivate: [AuthGuard]
    },
    {
      path: 'beneficiario/:ciaCia/:codEmp',
      component:BeneficiarioComponent, canActivate: [AuthGuard]
    },
    {
      path: 'capacitaciones/:codCia/:codEmp',
      component:CapacitacionesComponent, canActivate: [AuthGuard]
    },
    {
      path: 'dependientes/:codCia/:codEmp',
      component: DependientesComponent, canActivate: [AuthGuard]
    },
    {
      path: 'experiencia/:codCia/:codEmp',
      component: ExperienciaLaboralComponent , canActivate: [AuthGuard]
    },
    {
      path: 'equipoOficina/:codCia/:codEmp',
      component: EquipoOficinaComponent , canActivate: [AuthGuard]
    },
    {
      path: 'referencias/:codCia/:codEmp',
      component: ReferenciasComponent , canActivate: [AuthGuard]
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path:'programar-deducciones',
      component:ProgramarDeduccionesComponent, canActivate: [AuthGuard]
    },
    {
      path:'enviar-boletas',
      component:EnviarBoletasComponent, canActivate: [AuthGuard]
    },
    {
      path: '',
      redirectTo: '/pages/planilla',
      pathMatch: 'full'
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

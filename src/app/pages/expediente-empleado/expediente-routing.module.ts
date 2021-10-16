import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiarioComponent } from './beneficiario/beneficiario.component';
import { ExpedienteEmpleadoComponent } from './expediente-empleado.component';

const routes: Routes = [
    {
        path: '',
        component: ExpedienteEmpleadoComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpedienteRoutingModule {}

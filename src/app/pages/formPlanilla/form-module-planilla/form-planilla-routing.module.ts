import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPlanillaComponent } from '../form-planilla/form-planilla.component';


const routes: Routes = [
    {
        path: '',
        component: FormPlanillaComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormPlanillaRoutingModule {}

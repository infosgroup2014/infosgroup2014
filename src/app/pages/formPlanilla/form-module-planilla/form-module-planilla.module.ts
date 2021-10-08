import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPlanillaComponent } from '../form-planilla/form-planilla.component';
import { FormPlanillaRoutingModule } from './form-planilla-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IConfig, NgxMaskModule } from 'ngx-mask';


const maskConfigFunction: () => Partial<IConfig> = () => {
    return {
      validation: false,
    };
  };

@NgModule({
  declarations: [FormPlanillaComponent,],
  imports: [NgbModule,NgxMaskModule.forRoot(maskConfigFunction),
    CommonModule,FormPlanillaRoutingModule,FormsModule,ReactiveFormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FormModulePlanillaModule { }

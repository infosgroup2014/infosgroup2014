import { Component } from '@angular/core';
import { PlanillaService } from '../../../pages/servicio/planilla.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header *ngIf="servicio.logueado" fixed style="color:white;background-color: darkblue">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar *ngIf="servicio.logueado" class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {

  constructor(public servicio:PlanillaService){

  }
}

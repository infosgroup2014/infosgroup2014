import { Component, OnInit } from '@angular/core';
import { PlanillaService } from '../../servicio/planilla.service';

@Component({
  selector: 'ngx-enviar-boletas',
  templateUrl: './enviar-boletas.component.html',
  styleUrls: ['./enviar-boletas.component.scss']
})
export class EnviarBoletasComponent implements OnInit {
  listaTipoPlanilla: any;

  constructor(
    private planillaService: PlanillaService,
  ) {

  this.planillaService.obtenerTiposPlanilla(3, 2).subscribe(
    data => {
        this.listaTipoPlanilla = data;
    }
  );
  }
  ngOnInit(): void {
    this.planillaService.logueado=true;
  }

}


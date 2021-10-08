import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccionPersonalService } from '../servicio/accion-personal.service';
import { PlanillaService } from '../servicio/planilla.service';

declare var $: any;

@Component({
  selector: 'app-accion-personal-crear',
  templateUrl: './accion-crear.component.html',
  styleUrls: ['./accion-personal.component.css']
})
export class AccionCrearComponent implements OnInit {
  p: number = 1;
  tipoAccionSeleccion: number;
  listaTipoAccion: Array<any> = [];
  mostrarNOAfectaPlanilla: boolean;
  palabraClaveListadoTipoAccion: string;



  constructor(private accionService: AccionPersonalService, private router: Router,
    private planillaService: PlanillaService) {
    planillaService.logueado = true;
  }

  ngOnInit(): void {
    this.accionService.obtenerTipoAccion(3, 2).subscribe(tipo => this.listaTipoAccion = tipo);
  }


  public seleccionAccion(event): void {
    console.log('VALOR QUE VIENE' + JSON.stringify(event));

    this.planillaService.tipoAccionSeleccion = event;
    let bandera: number = event.tipoAccionPK.codTipoaccion;
    this.mostrarNOAfectaPlanilla = false;

    switch (bandera) {
      case 0:
        this.mostrarNOAfectaPlanilla = true;
        this.planillaService.leyenda = 'No Afecta Planilla';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 1:
        console.log("It is a Monday.");
        break;

      case 2:

        this.planillaService.leyenda = 'Dia Vacacion';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 3:
        this.planillaService.leyenda = 'Pago Vacacion';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 4:
        this.planillaService.leyenda = 'Incapacidad';
        this.router.navigate(['/pages/plantillaDos']);
        break;

      case 5:
        this.planillaService.leyenda = 'Permiso sin goce de sueldo';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 6:

        this.planillaService.leyenda = 'Promocion';
        this.router.navigate(['/pages/plantillaTres']);

        break;

      case 7:
        this.planillaService.leyenda = 'Aumento de Sueldo';
        this.router.navigate(['/pages/plantillaTres']);
        break;

      case 12:
        this.planillaService.leyenda = 'Suspension';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;


      case 17:
        this.planillaService.leyenda = 'Vacacion colectiva';
        this.router.navigate(['/pages/plantillaCinco']);
        break;

      case 18:
          this.planillaService.leyenda = 'Aumento de Sueldo Colectiva';
          this.router.navigate(['/pages/plantillaCinco']);
          break;



      case 19:
        this.planillaService.leyenda = 'Retiro';
        this.router.navigate(['/pages/plantillaCuatro']);
        break;


      case 20:
        this.planillaService.leyenda = 'Constancia de sueldo';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 21:
        this.planillaService.leyenda = 'Ausencia Injustificada';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 25:
        this.planillaService.leyenda = 'Cambio de Sueldo';
        this.router.navigate(['/pages/plantillaTres']);
        break;

      case 28:
        this.planillaService.leyenda = 'Paternidad';
        this.router.navigate(['/pages/plantillaDos']);
        break;

      case 30:
        this.planillaService.leyenda = 'Reingreso de empleado';
        this.router.navigate(['/pages/plantillaTres']);
        break;

      case 36:
        this.planillaService.leyenda = 'Traslado de planilla';
        this.router.navigate(['/pages/plantillaTres']);
        break;


      case 37:
        this.planillaService.leyenda = 'Baja Temporal';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;

      case 41:
          this.planillaService.leyenda = 'Permisos Colectivos';
          this.router.navigate(['/pages/plantillaCinco']);
          break;

      case 43:
        this.planillaService.leyenda = 'Sustitucion Temporal';
        this.router.navigate(['/pages/plantillaSiete']);
        break;


      case 45:
        this.planillaService.leyenda = 'Democion';
        this.router.navigate(['/pages/plantillaTres']);
        break;


      case 47:
        this.planillaService.leyenda = 'Ayuda por fallecimiento';
        this.router.navigate(['/pages/accion-no-afecta-planilla']);
        break;



      default:
        console.log("No such day exists!");
        break;
    }



  }



  regresar(): void {
    this.router.navigate(['/pages/accion-personal']);
  }




  buscarTiposAcciones() {

    this.listaTipoAccion = [];

    if (this.palabraClaveListadoTipoAccion) {

      this.accionService.obtenerTipoAccion(3, 2).subscribe(tipo => {
        this.listaTipoAccion = tipo;
        this.listaTipoAccion = this.listaTipoAccion.filter(element => {
          return element.nomTipoaccion.includes(this.palabraClaveListadoTipoAccion.toUpperCase());
        }
        )

      });
    } else {
      this.accionService.obtenerTipoAccion(3, 2).subscribe(tipo => this.listaTipoAccion = tipo);
    }

  }



}

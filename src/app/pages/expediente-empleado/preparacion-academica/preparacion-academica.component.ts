import { PlanillaService } from './../../servicio/planilla.service';
import { AcademicaService } from './../../servicio/prepAcademica.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preparacion-academica',
  templateUrl: './preparacion-academica.component.html',
  styleUrls: ['./preparacion-academica.component.css']
})
export class PreparacionAcademicaComponent implements OnInit {
  listaAcademico=[{nombreInstituto:'instituto',titulo:'doctor',anioEgre:2020,anioIngre:2018,colegiado:1},
  {nombreInstituto:'academia',titulo:'musico',anioEgre:2020,anioIngre:2018,colegiado:1}
  ];
listadoPaises:Array<any>;
listaDeptoPrepAcamedica:Array<any>;
codPais:number;
listarNiveles: Array<any>;
listarProfesiones: Array<any>;
listadoPrepAcademica: Array<any>;

  constructor(private router: Router, private servicioPlanilla: PlanillaService,
    private prepAcademicaService: AcademicaService ) {
    this.servicioPlanilla.obtenerPaises().subscribe(
        paises=>{
            this.listadoPaises=paises;
        }
        );
    this.obtenerCia(3,5);

  }


  ngOnInit(): void {
    this.listaAcademico=[{nombreInstituto:'instituto',titulo:'doctor',anioEgre:2020,anioIngre:2018,colegiado:1},
    {nombreInstituto:'academia',titulo:'musico',anioEgre:2020,anioIngre:2018,colegiado:1}
    ];

    this.listadoPrepAcademica
  }

  obtenerCia(cia: number, emp: number) {
    this.prepAcademicaService.obtenerNivelAcademico(cia).subscribe(
        niveles => {
            this.listarNiveles = niveles;
        }
    );

    this.prepAcademicaService.obtenerProfesionAcadem(cia).subscribe(
        profesion => {
            this.listarProfesiones = profesion;
        }
    );

    this.prepAcademicaService.obtenerPrepAcademica(cia, emp).subscribe((data) => {
        // console.log(JSON.stringify(dat));
        this.listadoPrepAcademica = data;
    });
  }

  obtenerDeptoPrepAcademica(data:any){
    this.codPais=data.codPais;
    this.servicioPlanilla.obtenerDeptoPais(data.codPais).subscribe(depto=>this.listaDeptoPrepAcamedica=depto);

  }


}

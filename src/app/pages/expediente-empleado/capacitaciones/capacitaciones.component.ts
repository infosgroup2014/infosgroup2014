import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AcademicaService } from '../../servicio/prepAcademica.service'
import { Capacitaciones } from '../modelo/Capacitaciones';

@Component({
  selector: 'app-capacitaciones',
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.css']
})
export class CapacitacionesComponent implements OnInit {


  listaCapacitaciones : Capacitaciones[] = [];

  listaTipoCapac=[
    {tipo:'Taller',valor:'TA'}, {tipo:'Charla',valor:'CH'},
    {tipo:'Curso',valor:'CR'},  {tipo:'Seminario',valor:'SM'},
    {tipo:'Pasantia',valor:'PA'}, {tipo:'Diplomado',valor:'DP'}
  ];

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private serviciosExpediente : AcademicaService )
   {
    this.router.paramMap.subscribe( params => {
      console.log('Parametros que llegan.');
      console.log(params);
      const CodCia = +params.get('codCia');
      const CodEmp = +params.get('codEmp');
      console.log('Empleado:'+CodCia+'-'+CodEmp);

      this.serviciosExpediente.obtenerCapacitaciones(CodCia, CodEmp).subscribe((data) => {
        console.log('regreso del servicio');
        console.log(data);
       this.listaCapacitaciones = data;
    //console.log('LO QUE Retorna el Servicio.......>'+JSON.stringify(data));
       });

    });



   }

  ngOnInit(): void {
  }




}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-capacitaciones',
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.css']
})
export class CapacitacionesComponent implements OnInit {

  listaCapacitaciones=[
    {nombre:'capacitación prueba 1',institucion:'Institucion 1',periodo:2021,fecha:'01/01/2021'},
    {nombre:'capacitación prueba 2',institucion:'Institucion 2',periodo:2021,fecha:'01/02/2021'},
    {nombre:'capacitación prueba 3',institucion:'Institucion 3',periodo:2021,fecha:'01/03/2021'}
  ];

  listaTipoCapac=[
    {tipo:'Taller',valor:'TA'}, {tipo:'Charla',valor:'CH'},
    {tipo:'Curso',valor:'CR'},  {tipo:'Seminario',valor:'SM'},
    {tipo:'Pasantia',valor:'PA'}, {tipo:'Diplomado',valor:'DP'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

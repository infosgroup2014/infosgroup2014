import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emergencias',
  templateUrl: './emergencias.component.html',
  styleUrls: ['./emergencias.component.css']
})
export class EmergenciasComponent implements OnInit {

  listaEmergencias=[
    {nombre:'Rafael',telefono:'10101010',parentesco:'hermano'},
    {nombre:'Samael',telefono:'010101010',parentesco:'hermano'},
    {nombre:'Isabel',telefono:'101010101',parentesco:'madre'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

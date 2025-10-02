import { Component } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [Carousel, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

}

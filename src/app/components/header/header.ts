import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuMobile } from '../menu-mobile/menu-mobile';


@Component({
  selector: 'app-header',
  imports: [RouterLink, MenuMobile],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  menuMobile: string = '';

  public ativarMenuMobile(){
    this.menuMobile = 'is-active';
  }
}

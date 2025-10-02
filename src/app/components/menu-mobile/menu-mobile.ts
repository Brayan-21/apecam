import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu-mobile',
  imports: [NgClass, CommonModule, RouterLink],
  templateUrl: './menu-mobile.html',
  styleUrl: './menu-mobile.css'
})
export class MenuMobile {

  @Input()
  menuAtivo: string = '';

  @Output()
  menuAtivoChange = new EventEmitter<string>();

  isSubmenuOpen = false;

  constructor(private router: Router) {
    // Escuta sempre quando a navegação termina
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeMenu(); 
      }
    });
  }

  closeMenu() {
    this.menuAtivo = '';
    this.menuAtivoChange.emit('');
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Main } from "./components/main/main";

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Main],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit{

  readonly isAdminRoute = signal(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAdminState();
      });
  }

  ngOnInit(): void {
    this.setTheme('light');
    this.updateAdminState();
  }

  private updateAdminState(): void {
    const url = this.router.url;
    const isAdmin = url.startsWith('/admin');
    this.isAdminRoute.set(isAdmin);
    document.body.classList.toggle('admin-mode', isAdmin);
  }

  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  }

}

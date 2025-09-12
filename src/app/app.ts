import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  ngOnInit(): void {
    this.setTheme('light');
  }

  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  }

}

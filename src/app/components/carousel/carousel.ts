import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel implements AfterViewInit, OnDestroy {
  images = [
    'apecam/apecam-02.webp',
    'apecam/apecam-06.webp',
    'apecam/apecam-07.webp',
    'apecam/apecam-08.webp',
    'apecam/apecam-09.webp',
    'apecam/apecam-11.webp',
    'apecam/apecam-12.webp',
    'apecam/apecam-13.webp',
    'apecam/apecam-15.webp',
    'apecam/apecam-16.webp',
    'apecam/apecam-17.webp',
    'apecam/apecam-18.webp',
    'apecam/apecam-19.webp',
    'apecam/apecam-20.webp',
    'apecam/apecam-21.webp',
    'apecam/apecam-22.webp',
    'apecam/apecam-23.webp',
    'apecam/apecam-24.webp',
    'apecam/apecam-25.webp',
  ];

  currentIndex = signal(0);
  private autoSlideInterval: any = null;
  private readonly SLIDE_DURATION = 6000; // 3 segundos entre slides

  ngAfterViewInit() {
    // Inicia o slide automático após a inicialização
    this.slideAutomatico();
  }

  ngOnDestroy() {
    // Limpa o intervalo quando o componente é destruído
    this.pararSlideAutomatico();
  }

  next() {
    this.currentIndex.update((i) => (i + 1) % this.images.length);
  }

  prev() {
    this.currentIndex.update(
      (i) => (i - 1 + this.images.length) % this.images.length
    );
  }

  public slideAutomatico() {
    // Para qualquer slide automático existente antes de iniciar um novo
    this.pararSlideAutomatico();
    
    this.autoSlideInterval = setInterval(() => {
      this.next();
    }, this.SLIDE_DURATION);
  }

  public pararSlideAutomatico() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  public pausarSlideAutomatico() {
    this.pararSlideAutomatico();
  }

  public retomarSlideAutomatico() {
    this.slideAutomatico();
  }

  goTo(index: number) {
    this.currentIndex.set(index);
    // Reinicia o slide automático quando o usuário navega manualmente
    this.slideAutomatico();
  }

  // Métodos para pausar/retomar ao passar mouse (opcional)
  onMouseEnter() {
    this.pausarSlideAutomatico();
  }

  onMouseLeave() {
    this.retomarSlideAutomatico();
  }
}
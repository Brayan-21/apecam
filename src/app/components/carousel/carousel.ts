import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  images = [
    'apecam/apecam-02.webp',
    'apecam/apecam-03.webp',
    'apecam/apecam-04.webp',
    'apecam/apecam-05.webp',
    'apecam/apecam-06.webp',
  ];

  currentIndex = signal(0);

  next() {
    this.currentIndex.update((i) => (i + 1) % this.images.length);
  }

  prev() {
    this.currentIndex.update(
      (i) => (i - 1 + this.images.length) % this.images.length
    );
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }
}

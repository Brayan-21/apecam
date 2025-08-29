import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  images = [
    'https://picsum.photos/id/1015/1200/600',
    'https://picsum.photos/id/1016/1200/600',
    'https://picsum.photos/id/1018/1200/600',
    'https://picsum.photos/id/1020/1200/600',
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

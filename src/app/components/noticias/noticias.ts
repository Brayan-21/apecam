import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiaService } from '../../shared/services/noticia.service';
import { Noticia } from '../../shared/models/noticia';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})
export class Noticias implements OnInit {
  noticias: Noticia[] = [];
  carregando = false;
  noticiaExpandida: number | null = null;

  constructor(private noticiaService: NoticiaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarNoticias();
  }

  carregarNoticias(): void {
    this.carregando = true;
    this.noticiaService.listar().subscribe({
      next: (noticias) => {
        this.noticias = noticias;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar notícias:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getImagemUrl(noticia: Noticia): string | undefined {
    if (!noticia.image_path) {
      return undefined;
    }
    let imagePath = noticia.image_path;
    if (imagePath.startsWith('uploads/')) {
      return `https://apecam.com.br/${imagePath}`;
    }
    return `https://apecam.com.br/uploads/noticias/${imagePath}`;
  }

  truncarTexto(texto: string, maxLength: number): string {
    if (!texto || texto === '-') return '-';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  }

  verMais(id: number): void {
    this.noticiaExpandida = this.noticiaExpandida === id ? null : id;
  }

  estaExpandida(id: number): boolean {
    return this.noticiaExpandida === id;
  }

  formatarData(data: Date | string | undefined): string {
    if (!data) return '-';
    const date = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  onImagemError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

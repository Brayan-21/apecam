import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoticiaService } from '../../../shared/services/noticia.service';
import { Noticia } from '../../../shared/models/noticia';
import { environment } from '../../../../environments/environment';
import { Alert, AlertType } from '../../../shared/components/alert/alert';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';

@Component({
    selector: 'app-admin-apecam-noticias',
    standalone: true,
    imports: [CommonModule, Alert, ConfirmModal],
    templateUrl: './apecam-noticias.html',
    styleUrl: './apecam-noticias.css'
})
export class AdminApecamNoticias implements OnInit {
    noticias: Noticia[] = [];
    carregando = false;
    noticiaExpandida: number | null = null;

    // Alert
    alertShow: boolean = false;
    alertType: AlertType = 'success';
    alertMessage: string = '';

    // Confirm Modal
    modalShow: boolean = false;
    modalTitle: string = 'Confirmar exclusão';
    modalMessage: string = '';
    modalType: 'danger' | 'warning' | 'info' = 'danger';
    noticiaParaExcluir: number | null = null;

    constructor(
        private noticiaService: NoticiaService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

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
                const errorMessage = err.error?.message || err.message || 'Erro ao carregar notícias. Tente novamente.';
                this.mostrarAlerta('error', errorMessage);
                this.carregando = false;
                this.cdr.detectChanges();
            }
        });
    }

    adicionarNova(): void {
        this.router.navigate(['/admin/painel/apecam-noticias/noticia-detalhe']);
    }

    editar(id: number): void {
        this.router.navigate(['/admin/painel/apecam-noticias/noticia-detalhe', id]);
    }

    excluir(id: number): void {
        const noticia = this.noticias.find(n => n.id === id);
        this.noticiaParaExcluir = id;
        this.modalTitle = 'Confirmar exclusão';
        this.modalMessage = noticia
            ? `Tem certeza que deseja excluir a notícia "${noticia.titulo}"? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.';
        this.modalType = 'danger';
        this.modalShow = true;
    }

    onModalConfirmed(): void {
        if (this.noticiaParaExcluir !== null) {
            const id = this.noticiaParaExcluir;
            this.modalShow = false;

            this.noticiaService.excluir(id).subscribe({
                next: (res) => {
                    if (res && res.ok) {
                        this.mostrarAlerta('success', res.message || 'Notícia excluída com sucesso!');
                        this.carregarNoticias();
                        this.cdr.detectChanges();
                    } else {
                        this.mostrarAlerta('error', res?.message || 'Erro ao excluir notícia.');
                        this.cdr.detectChanges();
                    }
                },
                error: (err) => {
                    console.error('Erro ao excluir notícia:', err);
                    const errorMessage = err.error?.message || err.message || 'Erro ao excluir notícia. Tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.cdr.detectChanges();
                }
            });
        }
        this.noticiaParaExcluir = null;
    }

    onModalCancelled(): void {
        this.modalShow = false;
        this.noticiaParaExcluir = null;
    }

    formatarData(data: Date | string | undefined): string {
        if (!data) return '-';
        const date = typeof data === 'string' ? new Date(data) : data;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    truncarTexto(texto: string, maxLength: number): string {
        if (!texto || texto === '-') return '-';
        if (texto.length <= maxLength) return texto;
        return texto.substring(0, maxLength) + '...';
    }

    getImagemUrl(noticia: Noticia): string | undefined {
        if (!noticia.image_path) {
            return undefined;
        }
        // Construir URL: https://apecam.com.br/uploads/noticias/{image_path}
        // O image_path já vem como "uploads/noticias/xxx.webp" ou apenas "xxx.webp"
        let imagePath = noticia.image_path;

        // Se já começa com uploads/, usar diretamente
        if (imagePath.startsWith('uploads/')) {
            return `https://apecam.com.br/${imagePath}`;
        }

        // Caso contrário, adicionar o prefixo
        return `https://apecam.com.br/uploads/noticias/${imagePath}`;
    }

    onImagemError(event: Event, noticia: Noticia): void {
        // Remove a URL da imagem se houver erro ao carregar
        const img = event.target as HTMLImageElement;
        img.style.display = 'none';
    }

    mostrarAlerta(type: AlertType, message: string): void {
        this.alertType = type;
        this.alertMessage = message;
        this.alertShow = true;
    }

    onAlertClosed(): void {
        this.alertShow = false;
    }

    verMais(id: number): void {
        this.noticiaExpandida = this.noticiaExpandida === id ? null : id;
    }

    estaExpandida(id: number): boolean {
        return this.noticiaExpandida === id;
    }
}

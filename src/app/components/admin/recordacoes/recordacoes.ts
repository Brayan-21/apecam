import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecordacaoService } from '../../../shared/services/recordacao.service';
import { Recordacao } from '../../../shared/models/recordacao';
import { Alert, AlertType } from '../../../shared/components/alert/alert';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';

@Component({
    selector: 'app-admin-recordacoes',
    standalone: true,
    imports: [CommonModule, Alert, ConfirmModal],
    templateUrl: './recordacoes.html',
    styleUrl: './recordacoes.css'
})
export class AdminRecordacoes implements OnInit {
    recordacoes: Recordacao[] = [];
    carregando = false;

    // Alert
    alertShow: boolean = false;
    alertType: AlertType = 'success';
    alertMessage: string = '';

    // Confirm Modal
    modalShow: boolean = false;
    modalTitle: string = 'Confirmar exclusão';
    modalMessage: string = '';
    modalType: 'danger' | 'warning' | 'info' = 'danger';
    recordacaoParaExcluir: number | null = null;

    // Image Modal
    imagemModalShow: boolean = false;
    imagemModalUrl: string = '';

    constructor(
        private recordacaoService: RecordacaoService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.carregarRecordacoes();
    }

    carregarRecordacoes(): void {
        this.carregando = true;
        this.recordacaoService.listar().subscribe({
            next: (recordacoes) => {
                this.recordacoes = recordacoes;
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar recordações:', err);
                const errorMessage = err.error?.message || err.message || 'Erro ao carregar recordações. Tente novamente.';
                this.mostrarAlerta('error', errorMessage);
                this.carregando = false;
                this.cdr.detectChanges();
            }
        });
    }

    adicionarNova(): void {
        this.router.navigate(['/admin/painel/recordacoes/recordacao-detalhe']);
    }

    excluir(id: number): void {
        const recordacao = this.recordacoes.find(r => r.id === id);
        this.recordacaoParaExcluir = id;
        this.modalTitle = 'Confirmar exclusão';
        this.modalMessage = 'Tem certeza que deseja excluir esta recordação? Esta ação não pode ser desfeita.';
        this.modalType = 'danger';
        this.modalShow = true;
    }

    onModalConfirmed(): void {
        if (this.recordacaoParaExcluir !== null) {
            const id = this.recordacaoParaExcluir;
            this.modalShow = false;

            this.recordacaoService.excluir(id).subscribe({
                next: (res) => {
                    if (res && res.ok) {
                        this.mostrarAlerta('success', res.message || 'Recordação excluída com sucesso!');
                        this.carregarRecordacoes();
                        this.cdr.detectChanges();
                    } else {
                        this.mostrarAlerta('error', res?.message || 'Erro ao excluir recordação.');
                        this.cdr.detectChanges();
                    }
                },
                error: (err) => {
                    console.error('Erro ao excluir recordação:', err);
                    const errorMessage = err.error?.message || err.message || 'Erro ao excluir recordação. Tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.cdr.detectChanges();
                }
            });
        }
        this.recordacaoParaExcluir = null;
    }

    onModalCancelled(): void {
        this.modalShow = false;
        this.recordacaoParaExcluir = null;
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

    getImagemUrl(recordacao: Recordacao): string | undefined {
        if (!recordacao.image_path) {
            return undefined;
        }
        let imagePath = recordacao.image_path;

        if (imagePath.startsWith('uploads/')) {
            return `https://apecam.com.br/${imagePath}`;
        }

        return `https://apecam.com.br/uploads/recordacoes/${imagePath}`;
    }

    onImagemError(event: Event, recordacao: Recordacao): void {
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

    abrirImagemModal(recordacao: Recordacao): void {
        const url = this.getImagemUrl(recordacao);
        if (url) {
            this.imagemModalUrl = url;
            this.imagemModalShow = true;
        }
    }

    fecharImagemModal(): void {
        this.imagemModalShow = false;
        this.imagemModalUrl = '';
    }
}

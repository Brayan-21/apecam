import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransparenciaService } from '../../../shared/services/transparencia.service';
import { Transparencia } from '../../../shared/models/transparencia';
import { Alert, AlertType } from '../../../shared/components/alert/alert';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';

@Component({
    selector: 'app-admin-transparencia',
    standalone: true,
    imports: [CommonModule, FormsModule, Alert, ConfirmModal],
    templateUrl: './transparencia.html',
    styleUrl: './transparencia.css'
})
export class AdminTransparencia implements OnInit {
    transparencias: Transparencia[] = [];
    transparenciasFiltradas: Transparencia[] = [];
    pastasDisponiveis: string[] = [];
    pastaSelecionada: string = 'todas';
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
    transparenciaParaExcluir: number | null = null;

    constructor(
        private transparenciaService: TransparenciaService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.carregarTransparencias();
    }

    carregarTransparencias(): void {
        this.carregando = true;
        this.transparenciaService.listar().subscribe({
            next: (transparencias) => {
                this.transparencias = transparencias;
                this.organizarPastas();
                this.filtrarPorPasta();
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar transparências:', err);
                const errorMessage = err.error?.message || err.message || 'Erro ao carregar transparências. Tente novamente.';
                this.mostrarAlerta('error', errorMessage);
                this.carregando = false;
                this.cdr.detectChanges();
            }
        });
    }

    organizarPastas(): void {
        const pastasSet = new Set<string>();
        this.transparencias.forEach(doc => {
            const pasta = doc.nome_pasta || 'Arquivos Avulsos';
            pastasSet.add(pasta);
        });
        this.pastasDisponiveis = ['todas', ...Array.from(pastasSet).sort()];
    }

    filtrarPorPasta(): void {
        if (this.pastaSelecionada === 'todas') {
            this.transparenciasFiltradas = this.transparencias;
        } else {
            this.transparenciasFiltradas = this.transparencias.filter(t => {
                const pasta = t.nome_pasta || 'Arquivos Avulsos';
                return pasta === this.pastaSelecionada;
            });
        }
    }

    adicionarNova(): void {
        this.router.navigate(['/admin/painel/transparencia/transparencia-detalhe']);
    }

    excluir(id: number): void {
        const transparencia = this.transparencias.find(t => t.id === id);
        this.transparenciaParaExcluir = id;
        this.modalTitle = 'Confirmar exclusão';
        this.modalMessage = transparencia
            ? `Tem certeza que deseja excluir o documento "${transparencia.nome_arquivo || 'sem nome'}"? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.';
        this.modalType = 'danger';
        this.modalShow = true;
    }

    onModalConfirmed(): void {
        if (this.transparenciaParaExcluir !== null) {
            const id = this.transparenciaParaExcluir;
            this.modalShow = false;

            this.transparenciaService.excluir(id).subscribe({
                next: (res) => {
                    if (res && res.ok) {
                        this.mostrarAlerta('success', res.message || 'Documento excluído com sucesso!');
                        this.carregarTransparencias();
                    } else {
                        this.mostrarAlerta('error', res?.message || 'Erro ao excluir documento.');
                    }
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Erro ao excluir documento:', err);
                    const errorMessage = err.error?.message || err.message || 'Erro ao excluir documento. Tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.cdr.detectChanges();
                }
            });
        }
        this.transparenciaParaExcluir = null;
    }

    onModalCancelled(): void {
        this.modalShow = false;
        this.transparenciaParaExcluir = null;
    }

    formatarData(data: Date | string | undefined): string {
        if (!data) return '-';
        const date = typeof data === 'string' ? new Date(data) : data;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    }

    getTipoArquivoLabel(tipo: string | undefined): string {
        switch (tipo) {
            case 'imagem':
                return 'Imagem';
            case 'pdf':
                return 'PDF';
            case 'planilha':
                return 'Planilha';
            default:
                return '-';
        }
    }

    getTipoArquivoIcon(tipo: string | undefined): string {
        switch (tipo) {
            case 'imagem':
                return 'image';
            case 'pdf':
                return 'picture_as_pdf';
            case 'planilha':
                return 'table_chart';
            default:
                return 'description';
        }
    }

    getArquivoUrl(transparencia: Transparencia): string | undefined {
        if (!transparencia.file_path) {
            return undefined;
        }
        let filePath = transparencia.file_path;

        if (filePath.startsWith('uploads/')) {
            return `https://apecam.com.br/${filePath}`;
        }

        return `https://apecam.com.br/uploads/transparencia/${filePath}`;
    }

    visualizar(transparencia: Transparencia): void {
        const url = this.getArquivoUrl(transparencia);
        if (url) {
            window.open(url, '_blank');
        }
    }

    mostrarAlerta(type: AlertType, message: string): void {
        this.alertType = type;
        this.alertMessage = message;
        this.alertShow = true;
    }

    onAlertClosed(): void {
        this.alertShow = false;
    }
}

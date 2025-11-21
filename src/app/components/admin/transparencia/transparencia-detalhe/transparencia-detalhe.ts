import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransparenciaService } from '../../../../shared/services/transparencia.service';
import { Transparencia } from '../../../../shared/models/transparencia';
import { Alert, AlertType } from '../../../../shared/components/alert/alert';

@Component({
    selector: 'app-transparencia-detalhe',
    standalone: true,
    imports: [CommonModule, FormsModule, Alert],
    templateUrl: './transparencia-detalhe.html',
    styleUrl: './transparencia-detalhe.css'
})
export class TransparenciaDetalhe {
    transparencia: Transparencia = {
        arquivo: ''
    };

    carregando = false;
    salvando = false;
    arquivo: File | null = null;
    tipoArquivo: 'imagem' | 'pdf' | 'planilha' = 'imagem';
    nomePasta: string = '';

    // Alert
    alertShow: boolean = false;
    alertType: AlertType = 'success';
    alertMessage: string = '';

    constructor(
        private transparenciaService: TransparenciaService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    salvar(): void {
        if (!this.validarFormulario()) {
            return;
        }

        if (!this.arquivo) {
            this.mostrarAlerta('warning', 'Por favor, selecione um arquivo.');
            return;
        }

        this.salvando = true;

        this.transparenciaService.criarTransparencia(this.arquivo, this.tipoArquivo, this.nomePasta).subscribe({
            next: (res) => {
                this.salvando = false;
                if (res && res.ok) {
                    this.mostrarAlerta('success', res.message || 'Documento criado com sucesso!');
                    setTimeout(() => this.voltar(), 1500);
                } else {
                    this.mostrarAlerta('error', res?.message || 'Erro ao criar documento.');
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao criar documento:', err);
                const errorMessage = err.error?.message || err.message || 'Erro ao salvar documento. Tente novamente.';
                this.mostrarAlerta('error', errorMessage);
                this.salvando = false;
                this.cdr.detectChanges();
            }
        });
    }

    validarFormulario(): boolean {
        if (!this.nomePasta || this.nomePasta.trim() === '') {
            this.mostrarAlerta('warning', 'Por favor, informe o nome da pasta.');
            return false;
        }

        if (!this.arquivo) {
            this.mostrarAlerta('warning', 'Por favor, selecione um arquivo.');
            return false;
        }

        // Validações específicas por tipo
        if (this.tipoArquivo === 'imagem') {
            if (this.arquivo.type !== 'image/webp') {
                this.mostrarAlerta('warning', 'Por favor, selecione apenas arquivos no formato WEBP.');
                return false;
            }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (this.arquivo.size > maxSize) {
                this.mostrarAlerta('warning', 'O arquivo deve ter no máximo 5MB.');
                return false;
            }
        } else if (this.tipoArquivo === 'pdf') {
            if (this.arquivo.type !== 'application/pdf') {
                this.mostrarAlerta('warning', 'Por favor, selecione apenas arquivos no formato PDF.');
                return false;
            }
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (this.arquivo.size > maxSize) {
                this.mostrarAlerta('warning', 'O arquivo PDF deve ter no máximo 10MB.');
                return false;
            }
        } else if (this.tipoArquivo === 'planilha') {
            const planilhaTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.oasis.opendocument.spreadsheet'
            ];
            if (!planilhaTypes.includes(this.arquivo.type) && !this.arquivo.name.match(/\.(xls|xlsx|ods)$/i)) {
                this.mostrarAlerta('warning', 'Por favor, selecione apenas arquivos de planilha (XLS, XLSX, ODS).');
                return false;
            }
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (this.arquivo.size > maxSize) {
                this.mostrarAlerta('warning', 'O arquivo de planilha deve ter no máximo 10MB.');
                return false;
            }
        }

        return true;
    }

    voltar(): void {
        this.router.navigate(['/admin/painel/transparencia']);
    }

    onArquivoChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            this.arquivo = file;

            // Criar preview se for imagem
            if (this.tipoArquivo === 'imagem' && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        this.transparencia.arquivo = e.target.result as string;
                        this.cdr.detectChanges();
                    }
                };
                reader.onerror = () => {
                    this.mostrarAlerta('error', 'Erro ao ler o arquivo.');
                    input.value = '';
                    this.arquivo = null;
                    this.cdr.detectChanges();
                };
                reader.readAsDataURL(file);
            } else {
                // Para PDF e planilha, apenas mostrar o nome
                this.transparencia.arquivo = file.name;
                this.cdr.detectChanges();
            }
        }
    }

    removerArquivo(): void {
        this.transparencia.arquivo = '';
        this.arquivo = null;
        const input = document.getElementById('arquivo') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
        this.cdr.detectChanges();
    }

    onTipoArquivoChange(): void {
        // Limpar arquivo quando mudar o tipo
        this.removerArquivo();
    }

    getTipoArquivoLabel(): string {
        switch (this.tipoArquivo) {
            case 'imagem':
                return 'Imagem';
            case 'pdf':
                return 'PDF';
            case 'planilha':
                return 'Planilha';
            default:
                return '';
        }
    }

    getAcceptTypes(): string {
        switch (this.tipoArquivo) {
            case 'imagem':
                return 'image/webp,.webp';
            case 'pdf':
                return 'application/pdf,.pdf';
            case 'planilha':
                return '.xls,.xlsx,.ods,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet';
            default:
                return '*';
        }
    }

    getMaxSize(): string {
        switch (this.tipoArquivo) {
            case 'imagem':
                return '5MB';
            case 'pdf':
            case 'planilha':
                return '10MB';
            default:
                return '';
        }
    }

    mostrarAlerta(type: AlertType, message: string): void {
        this.alertType = type;
        this.alertMessage = message;
        this.alertShow = true;
        this.cdr.detectChanges();
    }

    onAlertClosed(): void {
        this.alertShow = false;
    }
}


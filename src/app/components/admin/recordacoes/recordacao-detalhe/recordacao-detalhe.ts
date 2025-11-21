import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordacaoService } from '../../../../shared/services/recordacao.service';
import { Recordacao } from '../../../../shared/models/recordacao';
import { environment } from '../../../../../environments/environment';
import { Alert, AlertType } from '../../../../shared/components/alert/alert';

@Component({
    selector: 'app-recordacao-detalhe',
    standalone: true,
    imports: [CommonModule, FormsModule, Alert],
    templateUrl: './recordacao-detalhe.html',
    styleUrl: './recordacao-detalhe.css'
})
export class RecordacaoDetalhe {
    recordacao: Recordacao = {
        imagem: ''
    };

    carregando = false;
    salvando = false;
    arquivoImagem: File | null = null;

    // Alert
    alertShow: boolean = false;
    alertType: AlertType = 'success';
    alertMessage: string = '';

    constructor(
        private recordacaoService: RecordacaoService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    salvar(): void {
        if (!this.validarFormulario()) {
            return;
        }

        if (!this.arquivoImagem) {
            this.mostrarAlerta('warning', 'Por favor, selecione uma imagem.');
            return;
        }

        this.salvando = true;

        this.recordacaoService.criarRecordacao(this.arquivoImagem).subscribe({
            next: (res) => {
                this.salvando = false;
                if (res && res.ok) {
                    this.mostrarAlerta('success', res.message || 'Recordação criada com sucesso!');
                    setTimeout(() => this.voltar(), 1500);
                } else {
                    this.mostrarAlerta('error', res?.message || 'Erro ao criar recordação.');
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao criar recordação:', err);
                const errorMessage = err.error?.message || err.message || 'Erro ao salvar recordação. Tente novamente.';
                this.mostrarAlerta('error', errorMessage);
                this.salvando = false;
                this.cdr.detectChanges();
            }
        });
    }

    validarFormulario(): boolean {
        if (!this.arquivoImagem) {
            this.mostrarAlerta('warning', 'Por favor, selecione uma imagem.');
            return false;
        }
        return true;
    }

    voltar(): void {
        this.router.navigate(['/admin/painel/recordacoes']);
    }

    onImagemChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Validar se é WEBP
            if (file.type !== 'image/webp') {
                this.mostrarAlerta('warning', 'Por favor, selecione apenas arquivos no formato WEBP.');
                input.value = '';
                return;
            }

            // Validar tamanho (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB em bytes
            if (file.size > maxSize) {
                this.mostrarAlerta('warning', 'O arquivo deve ter no máximo 5MB.');
                input.value = '';
                return;
            }

            // Armazenar o arquivo File para envio
            this.arquivoImagem = file;

            // Criar preview (base64) para exibição
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    this.recordacao.imagem = e.target.result as string;
                    // Forçar detecção de mudanças para atualizar a view
                    this.cdr.detectChanges();
                }
            };
            reader.onerror = () => {
                this.mostrarAlerta('error', 'Erro ao ler o arquivo de imagem.');
                input.value = '';
                this.arquivoImagem = null;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    removerImagem(): void {
        this.recordacao.imagem = '';
        this.arquivoImagem = null;
        // Limpar o input file também
        const input = document.getElementById('imagem') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
        // Forçar detecção de mudanças
        this.cdr.detectChanges();
    }

    onImagemError(event: Event): void {
        console.error('Erro ao carregar imagem:', event);
        // Se a imagem não carregar, remover o preview
        this.recordacao.imagem = '';
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


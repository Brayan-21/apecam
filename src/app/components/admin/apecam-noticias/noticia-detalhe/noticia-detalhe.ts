import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NoticiaService } from '../../../../shared/services/noticia.service';
import { Noticia } from '../../../../shared/models/noticia';
import { environment } from '../../../../../environments/environment';
import { Alert, AlertType } from '../../../../shared/components/alert/alert';

@Component({
    selector: 'app-noticia-detalhe',
    standalone: true,
    imports: [CommonModule, FormsModule, Alert],
    templateUrl: './noticia-detalhe.html',
    styleUrl: './noticia-detalhe.css'
})
export class NoticiaDetalhe implements OnInit {
    noticia: Noticia = {
        titulo: '',
        imagem: '',
        descricao: ''
    };

    noticiaId: number | null = null;
    carregando = false;
    salvando = false;
    modoEdicao = false;
    arquivoImagem: File | null = null;

    // Alert
    alertShow: boolean = false;
    alertType: AlertType = 'success';
    alertMessage: string = '';

    constructor(
        private noticiaService: NoticiaService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.noticiaId = +id;
            this.modoEdicao = true;
            this.carregarNoticia(this.noticiaId);
        }
    }

    carregarNoticia(id: number): void {
        this.carregando = true;
        this.noticiaService.buscarPorId(id).subscribe({
            next: (noticia) => {
                // Construir URL completa da imagem se existir
                let imagemUrl = '';
                if (noticia.image_path) {
                    // Se já é uma URL completa, usar diretamente
                    if (noticia.image_path.startsWith('http://') || noticia.image_path.startsWith('https://') || noticia.image_path.startsWith('data:')) {
                        imagemUrl = noticia.image_path;
                    } else {
                        // Construir URL completa a partir do caminho relativo
                        const baseUrl = environment.api.replace('/api', '');
                        // Remover barra duplicada se houver
                        const imagePath = noticia.image_path.startsWith('/') ? noticia.image_path.substring(1) : noticia.image_path;
                        imagemUrl = `${baseUrl}/${imagePath}`;
                    }
                }

                // Mapear campos do banco para compatibilidade com o frontend
                this.noticia = {
                    ...noticia,
                    descricao: noticia.texto,
                    imagem: imagemUrl,
                    dataPublicacao: noticia.data_cadastro
                };
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar notícia:', err);
                this.mostrarAlerta('error', 'Erro ao carregar notícia. Tente novamente.');
                this.carregando = false;
                setTimeout(() => this.voltar(), 2000);
                this.cdr.detectChanges();
            }
        });
    }

    salvar(): void {
        if (!this.validarFormulario()) {
            return;
        }

        this.salvando = true;

        if (this.modoEdicao && this.noticiaId) {
            this.noticiaService.atualizarNoticia(
                this.noticiaId,
                this.noticia.titulo!,
                this.noticia.descricao!,
                this.arquivoImagem
            ).subscribe({
                next: (res) => {
                    this.salvando = false;
                    if (res && res.ok) {
                        this.mostrarAlerta('success', res.message || 'Notícia atualizada com sucesso!');
                        setTimeout(() => this.voltar(), 1500);
                    } else {
                        this.mostrarAlerta('error', res?.message || 'Erro ao atualizar notícia.');
                    }
                },
                error: (err) => {
                    console.error('Erro ao atualizar notícia:', err);
                    const errorMessage = err.error?.message || err.message || 'Erro ao salvar notícia. Tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.salvando = false;
                }
            });
        } else {
            this.noticiaService.criarNoticia(
                this.noticia.titulo!,
                this.noticia.descricao!,
                this.arquivoImagem
            ).subscribe({
                next: (res) => {
                    this.salvando = false;
                    if (res.ok) {
                        this.mostrarAlerta('success', 'Notícia criada com sucesso!');
                        setTimeout(() => this.voltar(), 1500);
                    } else {
                        this.mostrarAlerta('error', res.message || 'Erro ao criar notícia.');
                    }
                },
                error: (err) => {
                    console.error('Erro ao criar notícia:', err);
                    const errorMessage = err.error?.message || 'Erro ao salvar notícia. Tente novamente.';
                    this.mostrarAlerta('error', errorMessage);
                    this.salvando = false;
                }
            });
        }
    }

    validarFormulario(): boolean {
        if (!this.noticia.titulo || this.noticia.titulo.trim() === '') {
            this.mostrarAlerta('warning', 'Por favor, preencha o título da notícia.');
            return false;
        }
        if (!this.noticia.descricao || this.noticia.descricao.trim() === '') {
            this.mostrarAlerta('warning', 'Por favor, preencha a descrição da notícia.');
            return false;
        }
        return true;
    }

    voltar(): void {
        this.router.navigate(['/admin/painel/apecam-noticias']);
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
                    this.noticia.imagem = e.target.result as string;
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
        this.noticia.imagem = '';
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
        this.noticia.imagem = '';
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


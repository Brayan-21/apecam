import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordacaoService } from '../../shared/services/recordacao.service';
import { Recordacao } from '../../shared/models/recordacao';

@Component({
	selector: 'app-galeria',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './galeria.html',
	styleUrl: './galeria.css'
})
export class Galeria implements OnInit {
	recordacoes: Recordacao[] = [];
	carregando = false;

	// Image Modal
	imagemModalShow: boolean = false;
	imagemModalUrl: string = '';

	constructor(private recordacaoService: RecordacaoService, private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.carregarRecordacoes();
	}

	carregarRecordacoes(): void {
		this.carregando = true;
		this.recordacaoService.listarPublicas().subscribe({
			next: (recordacoes) => {
				console.log('Recordações carregadas:', recordacoes);
				this.recordacoes = recordacoes;
				this.carregando = false;
        this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Erro ao carregar recordações:', err);
				this.recordacoes = [];
				this.carregando = false;
        this.cdr.detectChanges();
			}
		});
	}

	getImagemUrl(recordacao: Recordacao): string | null {
		if (!recordacao || !recordacao.image_path) {
			console.log('Recordação sem image_path:', recordacao);
			return null;
		}
		let imagePath = recordacao.image_path.trim();

		// Se já é uma URL completa, retornar diretamente
		if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
			return imagePath;
		}

		// Se começa com uploads/, usar diretamente
		if (imagePath.startsWith('uploads/')) {
			const url = `https://apecam.com.br/${imagePath}`;
			console.log('URL construída (uploads/):', url);
			return url;
		}

		// Caso contrário, adicionar o prefixo
		const url = `https://apecam.com.br/uploads/recordacoes/${imagePath}`;
		console.log('URL construída (prefixo):', url);
		return url;
	}

	temImagemValida(recordacao: Recordacao): boolean {
		return !!this.getImagemUrl(recordacao);
	}

	onImagemError(event: Event): void {
		const img = event.target as HTMLImageElement;
		console.error('Erro ao carregar imagem:', img.src);
		// Não esconder a imagem, apenas logar o erro para debug
		img.style.opacity = '0.5';
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



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransparenciaService } from '../../shared/services/transparencia.service';
import { Transparencia } from '../../shared/models/transparencia';

interface DocumentosPorPasta {
    nomePasta: string;
    documentos: Transparencia[];
}

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transparencia.html',
  styleUrl: './transparencia.css'
})
export class TransparenciaComponent implements OnInit {
    transparencias: Transparencia[] = [];
    documentosAgrupados: DocumentosPorPasta[] = [];
    pastasDisponiveis: string[] = [];
    pastaSelecionada: string = 'todas';
    carregando = false;

    constructor(
        private transparenciaService: TransparenciaService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.carregarTransparencias();
    }

    carregarTransparencias(): void {
        this.carregando = true;
        this.transparenciaService.listarPublicas().subscribe({
            next: (transparencias) => {
                this.transparencias = transparencias;
                this.organizarPorPastas();
                this.carregando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar transparências:', err);
                this.carregando = false;
                this.cdr.detectChanges();
            }
        });
    }

    organizarPorPastas(): void {
        // Agrupar documentos por nome_pasta
        const grupos: { [key: string]: Transparencia[] } = {};
        const pastasSet = new Set<string>();

        this.transparencias.forEach(doc => {
            const pasta = doc.nome_pasta || 'Arquivos Avulsos';
            if (!grupos[pasta]) {
                grupos[pasta] = [];
            }
            grupos[pasta].push(doc);
            pastasSet.add(pasta);
        });

        // Converter para array e ordenar
        this.documentosAgrupados = Object.keys(grupos)
            .sort()
            .map(nomePasta => ({
                nomePasta,
                documentos: grupos[nomePasta].sort((a, b) => {
                    const dataA = a.data_cadastro ? new Date(a.data_cadastro).getTime() : 0;
                    const dataB = b.data_cadastro ? new Date(b.data_cadastro).getTime() : 0;
                    return dataB - dataA; // Mais recentes primeiro
                })
            }));

        // Criar lista de pastas para o dropdown
        this.pastasDisponiveis = ['todas', ...Array.from(pastasSet).sort()];
    }

    filtrarPorPasta(): void {
        this.organizarPorPastas();
        this.cdr.detectChanges();
    }

    getDocumentosFiltrados(): DocumentosPorPasta[] {
        if (this.pastaSelecionada === 'todas') {
            return this.documentosAgrupados;
        }
        return this.documentosAgrupados.filter(grupo => grupo.nomePasta === this.pastaSelecionada);
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

    formatarData(data: Date | string | undefined): string {
        if (!data) return '-';
        const date = typeof data === 'string' ? new Date(data) : data;
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
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

    getTipoArquivoLabel(tipo: string | undefined): string {
        switch (tipo) {
            case 'imagem':
                return 'Imagem';
            case 'pdf':
                return 'PDF';
            case 'planilha':
                return 'Planilha';
            default:
                return 'Arquivo';
        }
    }
}

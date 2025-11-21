export class Transparencia {
    id?: number;
    nome_arquivo?: string;
    tipo_arquivo?: 'imagem' | 'pdf' | 'planilha';
    nome_pasta?: string; // Campo no banco de dados
    file_path?: string; // Campo no banco de dados
    data_cadastro?: string | Date; // Campo no banco de dados

    // Propriedades auxiliares para compatibilidade com o frontend
    arquivo?: string;
    dataPublicacao?: Date | string;
}


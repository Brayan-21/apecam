export class Noticia {
    id?: number;
    titulo?: string;
    texto?: string; // Campo no banco de dados
    image_path?: string; // Campo no banco de dados
    data_cadastro?: string | Date; // Campo no banco de dados

    // Propriedades auxiliares para compatibilidade com o frontend
    descricao?: string;
    imagem?: string;
    dataPublicacao?: Date | string;
}


export class Recordacao {
    id?: number;
    image_path?: string; // Campo no banco de dados
    data_cadastro?: string | Date; // Campo no banco de dados

    // Propriedades auxiliares para compatibilidade com o frontend
    imagem?: string;
    dataPublicacao?: Date | string;
}


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Transparencia } from '../models/transparencia';

interface ListarTransparenciasResponse {
    ok: boolean;
    message: string;
    data: Transparencia[];
    total?: number;
    filtro?: string;
}

interface ConsultarTransparenciaResponse {
    ok: boolean;
    message: string;
    data: Transparencia;
}

interface CriarTransparenciaResponse {
    ok: boolean;
    message: string;
    data: {
        id: number;
        nome_arquivo: string;
        tipo_arquivo: string;
        nome_pasta: string;
        file_path: string;
        data_cadastro: string;
    };
}

interface ExcluirTransparenciaResponse {
    ok: boolean;
    message: string;
    data: {
        id: number;
        nome_arquivo: string;
        tipo_arquivo: string;
    };
}

@Injectable({
  providedIn: 'root',
})
export class TransparenciaService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  public listar(tipoArquivo?: 'imagem' | 'pdf' | 'planilha'): Observable<Transparencia[]> {
    // A API não requer autenticação para listar
    let url = `${this.api}/listar-transparencias`;

    // Adiciona filtro por tipo se fornecido
    if (tipoArquivo && ['imagem', 'pdf', 'planilha'].includes(tipoArquivo)) {
      url += `?tipo_arquivo=${tipoArquivo}`;
    }

    return this.http.get<ListarTransparenciasResponse>(url).pipe(
      map(response => {
        if (response && response.ok !== undefined) {
          if (Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }

        if (Array.isArray(response)) {
          return response;
        }

        throw new Error(response?.message || 'Formato de resposta inválido da API');
      }),
      catchError(error => {
        console.error('Erro ao listar transparências:', error);
        throw error;
      })
    );
  }

  public listarPublicas(): Observable<Transparencia[]> {
    return this.http.get<ListarTransparenciasResponse>(`${this.api}/listar-transparencias`).pipe(
      map(response => {
        if (response && response.ok !== undefined) {
          if (Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }
        if (Array.isArray(response)) {
          return response;
        }
        throw new Error(response?.message || 'Formato de resposta inválido da API');
      }),
      catchError(error => {
        console.error('Erro ao listar transparências públicas:', error);
        throw error;
      })
    );
  }

  public buscarPorId(id: number): Observable<Transparencia> {
    return this.http.get<ConsultarTransparenciaResponse>(`${this.api}/consultar-transparencia?id=${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.ok && response.data) {
          return response.data;
        }
        throw new Error(response?.message || 'Transparência não encontrada');
      }),
      catchError(error => {
        console.error('Erro ao buscar transparência:', error);
        throw error;
      })
    );
  }

  public criarTransparencia(arquivo: File | null, tipoArquivo: 'imagem' | 'pdf' | 'planilha', nomePasta?: string): Observable<CriarTransparenciaResponse> {
    if (!arquivo) {
      throw new Error('Arquivo é obrigatório');
    }

    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipo_arquivo', tipoArquivo);

    if (nomePasta) {
      formData.append('nome_pasta', nomePasta.trim());
    }

    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Não definir Content-Type - o navegador define automaticamente com boundary para FormData
    return this.http.post<CriarTransparenciaResponse>(`${this.api}/criar-transparencia`, formData, { headers }).pipe(
      map(response => {
        if (response && response.ok) {
          return response;
        }
        throw new Error(response?.message || 'Erro ao criar transparência');
      }),
      catchError(error => {
        console.error('Erro ao criar transparência:', error);
        throw error;
      })
    );
  }

  public excluir(id: number): Observable<ExcluirTransparenciaResponse> {
    return this.http.delete<ExcluirTransparenciaResponse>(`${this.api}/deletar-transparencia?id=${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.ok) {
          return response;
        }
        throw new Error(response?.message || 'Erro ao excluir transparência');
      }),
      catchError(error => {
        console.error('Erro ao excluir transparência:', error);
        throw error;
      })
    );
  }
}


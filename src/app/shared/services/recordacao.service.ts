import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Recordacao } from '../models/recordacao';

interface ListarRecordacoesResponse {
    ok: boolean;
    message: string;
    data: Recordacao[];
    total?: number;
}

interface ConsultarRecordacaoResponse {
    ok: boolean;
    message: string;
    data: Recordacao;
}

interface CriarRecordacaoResponse {
    ok: boolean;
    message: string;
    data: {
        id: number;
        image_path: string;
        data_cadastro: string;
    };
}

interface ExcluirRecordacaoResponse {
    ok: boolean;
    message: string;
    data: {
        id: number;
    };
}

@Injectable({
  providedIn: 'root',
})
export class RecordacaoService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  public listar(): Observable<Recordacao[]> {
    // API pública (autenticação comentada no backend)
    return this.http.get<ListarRecordacoesResponse>(`${this.api}/listar-recordacoes`).pipe(
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
        console.error('Erro ao listar recordações:', error);
        throw error;
      })
    );
  }

  public listarPublicas(): Observable<Recordacao[]> {
    return this.http.get<ListarRecordacoesResponse>(`${this.api}/listar-recordacoes`).pipe(
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
        console.error('Erro ao listar recordações públicas:', error);
        throw error;
      })
    );
  }

  public buscarPorId(id: number): Observable<Recordacao> {
    return this.http.get<ConsultarRecordacaoResponse>(`${this.api}/consultar-recordacao?id=${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.ok && response.data) {
          return response.data;
        }
        throw new Error(response?.message || 'Recordação não encontrada');
      }),
      catchError(error => {
        console.error('Erro ao buscar recordação:', error);
        throw error;
      })
    );
  }

  public criarRecordacao(imagem: File | null): Observable<CriarRecordacaoResponse> {
    if (!imagem) {
      throw new Error('Imagem é obrigatória');
    }

    const formData = new FormData();
    formData.append('imagem', imagem);

    const token = sessionStorage.getItem('token');
    const headers: { [key: string]: string } = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.http.post<CriarRecordacaoResponse>(`${this.api}/criar-recordacao`, formData, { headers }).pipe(
      map(response => {
        if (response && response.ok) {
          return response;
        }
        throw new Error(response?.message || 'Erro ao criar recordação');
      }),
      catchError(error => {
        console.error('Erro ao criar recordação:', error);
        throw error;
      })
    );
  }

  public excluir(id: number): Observable<ExcluirRecordacaoResponse> {
    // A API recebe o ID como query parameter: ?id=123
    return this.http.delete<ExcluirRecordacaoResponse>(`${this.api}/deletar-recordacao?id=${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.ok) {
          return response;
        }
        throw new Error(response?.message || 'Erro ao excluir recordação');
      }),
      catchError(error => {
        console.error('Erro ao excluir recordação:', error);
        throw error;
      })
    );
  }
}


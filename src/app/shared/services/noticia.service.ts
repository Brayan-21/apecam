import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Noticia } from '../models/noticia';

interface ListarNoticiasResponse {
    ok: boolean;
    message: string;
    data: Noticia[];
    total: number;
}

interface ConsultarNoticiaResponse {
    ok: boolean;
    message: string;
    data: Noticia;
}

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  private api = environment.api;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  public listar(): Observable<Noticia[]> {
    return this.http.get<ListarNoticiasResponse>(`${this.api}/listar-noticias`, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Verificar se a resposta tem a estrutura esperada
        if (response && response.ok !== undefined) {
          // Se response.data é um array, retornar
          if (Array.isArray(response.data)) {
            return response.data;
          }
          // Se data é null ou undefined, retornar array vazio
          return [];
        }

        // Se a resposta já é um array (caso raro)
        if (Array.isArray(response)) {
          return response;
        }

        // Se chegou aqui, formato inválido
        throw new Error(response?.message || 'Formato de resposta inválido da API');
      }),
      catchError(error => {
        console.error('Erro ao listar notícias:', error);
        throw error;
      })
    );
  }

  public listarPublicas(): Observable<Noticia[]> {
    // Método público sem autenticação (se necessário criar endpoint público)
    // Por enquanto, usa o mesmo endpoint mas sem token
    return this.http.get<ListarNoticiasResponse>(`${this.api}/listar-noticias`).pipe(
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
        console.error('Erro ao listar notícias públicas:', error);
        throw error;
      })
    );
  }

  public buscarPorId(id: number): Observable<Noticia> {
    // A API recebe o ID como query parameter: ?id=123
    return this.http.get<ConsultarNoticiaResponse>(`${this.api}/consultar-noticia?id=${id}`, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.ok && response.data) {
          return response.data;
        }
        throw new Error(response?.message || 'Notícia não encontrada');
      }),
      catchError(error => {
        console.error('Erro ao buscar notícia:', error);
        throw error;
      })
    );
  }

  public criar(noticia: Noticia): Observable<Noticia> {
    return this.http.post<Noticia>(`${this.api}/noticias`, noticia, { headers: this.getHeaders() });
  }

  public criarNoticia(titulo: string, descricao: string, imagem: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    const token = sessionStorage.getItem('token');
    const headers: { [key: string]: string } = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.http.post<any>(`${this.api}/criar-noticia`, formData, { headers });
  }

  public atualizar(id: number, noticia: Noticia): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.api}/noticias/${id}`, noticia, { headers: this.getHeaders() });
  }

  public atualizarNoticia(id: number, titulo: string, descricao: string, imagem: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    const token = sessionStorage.getItem('token');
    const headers: { [key: string]: string } = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.http.post<any>(`${this.api}/atualizar-noticia`, formData, { headers });
  }

  public excluir(id: number): Observable<any> {
    // A API recebe o ID como query parameter: ?id=123
    return this.http.delete<any>(`${this.api}/deletar-noticia?id=${id}`, { headers: this.getHeaders() });
  }
}


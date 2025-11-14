import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioLogin } from '../models/usuario-login';

@Injectable({
  providedIn: 'root',
})
export class Login {

  private api = environment.api;
  
  constructor(
    private http: HttpClient
  ){}

  public login(usuarioLogin: UsuarioLogin): Observable<any>{
    return this.http.post<any>(`${this.api}/login`, usuarioLogin);
  }

}

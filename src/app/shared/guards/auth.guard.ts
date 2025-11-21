import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = sessionStorage.getItem('token');

  // Se não tem token no sessionStorage, redireciona direto
  if (!token) {
    router.navigate(['/admin']);
    return false;
  }

  // Valida o token no backend
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return http.get<{ ok: boolean; message: string }>(`${environment.api}/validar-token`, { headers }).pipe(
    map(response => {
      if (response.ok) {
        return true;
      } else {
        sessionStorage.removeItem('token');
        router.navigate(['/admin']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Erro ao validar token:', error);
      sessionStorage.removeItem('token');
      router.navigate(['/admin']);
      return of(false);
    })
  );
};

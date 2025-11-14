import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface AdminMenuItem {
    label: string;
    route: string;
}

@Component({
    selector: 'app-admin-painel',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './admin-painel.html',
    styleUrl: './admin-painel.css'
})
export class AdminPainel {
    readonly menus: AdminMenuItem[] = [
        { label: 'Apecam Notícias', route: 'apecam-noticias' },
        { label: 'Agenda', route: 'agenda' },
        { label: 'Nossas Conquistas', route: 'nossas-conquistas' },
        { label: 'Entrevistas', route: 'entrevistas' },
        { label: 'Histórias de Superação', route: 'historias-superacao' },
        { label: 'Recordações', route: 'recordacoes' },
        { label: 'Transparência da Apecam', route: 'transparencia' }
    ];

    constructor(private router: Router) {}

    logout(): void {
        this.router.navigate(['/admin']);
        sessionStorage.removeItem('token');
    }
}

import { Routes } from '@angular/router';
import { QuemSomos } from './components/quem-somos/quem-somos';
import { Modalidades } from './components/modalidades/modalidades';
import { ApecamLovers } from './components/apecam-lovers/apecam-lovers';
import { Historia } from './components/historia/historia';
import { QueroDoar } from './components/quero-doar/quero-doar';
import { Contatos } from './components/contatos/contatos';
import { Inicio } from './components/inicio/inicio';
import { Galeria } from './components/galeria/galeria';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/inicio/inicio').then(c => c.Inicio)
    },
    {
        path: 'recordacoes',
        loadComponent: () => import('./components/galeria/galeria').then(c => c.Galeria)
    },
    {
        path: 'quem-somos',
        loadComponent: () => import('./components/quem-somos/quem-somos').then(c => c.QuemSomos)
    },
    {
        path: 'apecam-lovers',
        loadComponent: () => import('./components/apecam-lovers/apecam-lovers').then(c => c.ApecamLovers)
    },
    {
        path: 'modalidades',
        loadComponent: () => import('./components/modalidades/modalidades').then(c => c.Modalidades)
    },
    {
        path: 'historia-esporte-paralimpico',
        loadComponent: () => import('./components/historia/historia').then(c => c.Historia)
    },
    {
        path: 'quero-doar',
        loadComponent: () => import('./components/quero-doar/quero-doar').then(c => c.QueroDoar)
    },
    {
        path: 'contato',
        loadComponent: () => import('./components/contatos/contatos').then(c => c.Contatos)
    },
    {
        path: 'noticias',
        loadComponent: () => import('./components/noticias/noticias').then(c => c.Noticias)
    },
    {
        path: 'agenda',
        loadComponent: () => import('./components/agenda/agenda').then(c => c.Agenda)
    },
    {
        path: 'conquistas',
        loadComponent: () => import('./components/conquistas/conquistas').then(c => c.Conquistas)
    },
    {
        path: 'entrevistas',
        loadComponent: () => import('./components/entrevistas/entrevistas').then(c => c.Entrevistas)
    },
    {
        path: 'historias-superacao',
        loadComponent: () => import('./components/historias-superacao/historias-superacao').then(c => c.HistoriasSuperacao)
    },
    {
        path: 'admin',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/admin/admin-login/admin-login').then(c => c.AdminLogin)
            },
            {
                path: 'painel',
                loadComponent: () => import('./components/admin/admin-painel/admin-painel').then(c => c.AdminPainel),
                canActivate: [authGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'apecam-noticias'
                    },
                    {
                        path: 'apecam-noticias',
                        children: [
                            {
                                path: '',
                                loadComponent: () => import('./components/admin/apecam-noticias/apecam-noticias').then(c => c.AdminApecamNoticias),
                                canActivate: [authGuard]
                            },
                            {
                                path: 'noticia-detalhe/:id',
                                loadComponent: () => import('./components/admin/apecam-noticias/noticia-detalhe/noticia-detalhe').then(c => c.NoticiaDetalhe),
                                canActivate: [authGuard]
                            },
                            {
                                path: 'noticia-detalhe',
                                loadComponent: () => import('./components/admin/apecam-noticias/noticia-detalhe/noticia-detalhe').then(c => c.NoticiaDetalhe),
                                canActivate: [authGuard]
                            }
                        ]
                    },
                    {
                        path: 'agenda',
                        loadComponent: () => import('./components/admin/agenda/agenda').then(c => c.AdminAgenda),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'nossas-conquistas',
                        loadComponent: () => import('./components/admin/nossas-conquistas/nossas-conquistas').then(c => c.AdminNossasConquistas),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'entrevistas',
                        loadComponent: () => import('./components/admin/entrevistas/entrevistas').then(c => c.AdminEntrevistas),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'historias-superacao',
                        loadComponent: () => import('./components/admin/historias-superacao/historias-superacao').then(c => c.AdminHistoriasSuperacao),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'recordacoes',
                        loadComponent: () => import('./components/admin/recordacoes/recordacoes').then(c => c.AdminRecordacoes),
                        canActivate: [authGuard]
                    },
                    {
                        path: 'transparencia',
                        loadComponent: () => import('./components/admin/transparencia/transparencia').then(c => c.AdminTransparencia),
                        canActivate: [authGuard]
                    }
                ]
            }
        ]
    }
];

import { Routes } from '@angular/router';
import { QuemSomos } from './components/quem-somos/quem-somos';
import { Modalidades } from './components/modalidades/modalidades';
import { ApecamLovers } from './components/apecam-lovers/apecam-lovers';
import { Historia } from './components/historia/historia';
import { QueroDoar } from './components/quero-doar/quero-doar';
import { Contatos } from './components/contatos/contatos';
import { Inicio } from './components/inicio/inicio';
import { Galeria } from './components/galeria/galeria';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/inicio/inicio').then(c => c.Inicio)
    },
    {
        path: 'galeria',
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
    }
];

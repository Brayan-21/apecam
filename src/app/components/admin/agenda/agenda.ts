import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    CalendarModule,
    CalendarView,
    CalendarEvent,
    CalendarMonthViewDay,
    DateAdapter,
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Subject } from 'rxjs';
import { isSameDay, isSameMonth, startOfDay } from 'date-fns';

@Component({
    selector: 'app-admin-agenda',
    standalone: true,
    imports: [CommonModule, FormsModule, CalendarModule],
    providers: [
        {
            provide: DateAdapter,
            useFactory: adapterFactory
        },
        CalendarUtils,
        CalendarA11y,
        CalendarDateFormatter,
        CalendarEventTitleFormatter
    ],
    templateUrl: './agenda.html',
    styleUrl: './agenda.css'
})
export class AdminAgenda {
    readonly CalendarView = CalendarView;
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    activeDayIsOpen = true;

    eventos: CalendarEvent[] = [
        {
            title: 'Treino de Bocha Paralímpica',
            start: startOfDay(new Date()),
            color: {
                primary: '#FF6634',
                secondary: 'rgba(255,102,52,0.16)'
            }
        }
    ];

    refresh: Subject<void> = new Subject<void>();
    diaSelecionada: Date | null = null;
    eventosSelecionados: CalendarEvent[] = [];
    novoTitulo = '';
    corSelecionada: 'primary' | 'neutral' | 'apoio' = 'primary';

    readonly paleta = {
        primary: {
            primary: '#FF6634',
            secondary: 'rgba(255,102,52,0.16)'
        },
        neutral: {
            primary: '#0f0f10',
            secondary: 'rgba(15,15,16,0.08)'
        },
        apoio: {
            primary: '#FF9C6E',
            secondary: 'rgba(255,156,110,0.18)'
        }
    };

    diaClicado(evento: { day: CalendarMonthViewDay<Date> }): void {
        const day = evento.day;
        if (!isSameMonth(day.date, this.viewDate)) {
            return;
        }

        if (
            this.diaSelecionada &&
            isSameDay(this.diaSelecionada, day.date) &&
            this.activeDayIsOpen
        ) {
            this.activeDayIsOpen = false;
        } else {
            this.activeDayIsOpen = true;
        }

        this.viewDate = day.date;
        this.diaSelecionada = day.date;
        this.eventosSelecionados = (day.events as CalendarEvent[]) ?? [];
    }

    eventoClicado(evento: CalendarEvent): void {
        const data = evento.start;
        if (!data) {
            return;
        }

        this.viewDate = data;
        this.diaSelecionada = data;
        this.activeDayIsOpen = true;
        this.eventosSelecionados = this.eventos.filter(e =>
            isSameDay(e.start, data)
        );
    }

    mudarVisao(view: CalendarView): void {
        this.view = view;
        this.diaSelecionada = null;
        this.eventosSelecionados = [];
        this.activeDayIsOpen = false;
    }

    adicionarEvento(): void {
        if (!this.diaSelecionada || !this.novoTitulo.trim()) {
            return;
        }

        const cor = this.paleta[this.corSelecionada];

        this.eventos = [
            ...this.eventos,
            {
                title: this.novoTitulo.trim(),
                start: startOfDay(this.diaSelecionada),
                color: cor
            }
        ];

        this.novoTitulo = '';
        this.activeDayIsOpen = true;
        this.eventosSelecionados = this.eventos.filter(evento =>
            isSameDay(evento.start, this.diaSelecionada!)
        );
        this.refresh.next();
    }

    removerEvento(evento: CalendarEvent): void {
        this.eventos = this.eventos.filter(item => item !== evento);
        if (this.diaSelecionada) {
            this.eventosSelecionados = this.eventos.filter(e =>
                isSameDay(e.start, this.diaSelecionada!)
            );
        }
        this.refresh.next();
    }
}

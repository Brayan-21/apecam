import { Component, ElementRef, ViewChild, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
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
import { format, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

registerLocaleData(localePt);

interface HoverInfo {
    date: Date;
    formattedDate: string;
    events: CalendarEvent[];
    top: number;
    left: number;
    side: 'right' | 'left';
}

@Component({
    selector: 'app-agenda',
    standalone: true,
    imports: [CommonModule, CalendarModule],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: DateAdapter, useFactory: adapterFactory },
        CalendarUtils,
        CalendarA11y,
        CalendarDateFormatter,
        CalendarEventTitleFormatter
    ],
    templateUrl: './agenda.html',
    styleUrl: './agenda.css'
})
export class Agenda {
    @ViewChild('calendarContainer', { static: true }) calendarContainer?: ElementRef<HTMLDivElement>;

    readonly CalendarView = CalendarView;
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    locale = 'pt-BR';

    eventos: CalendarEvent[] = [
        {
            title: 'Treino de Bocha Paralímpica',
            start: new Date(),
            color: {
                primary: '#FF6634',
                secondary: 'rgba(255,102,52,0.16)'
            }
        },
        {
            title: 'Atendimento multidisciplinar',
            start: new Date(new Date().setDate(new Date().getDate() + 2)),
            color: {
                primary: '#0f0f10',
                secondary: 'rgba(15,15,16,0.08)'
            }
        }
    ];

    hoverInfo: HoverInfo | null = null;
    private readonly painelLargura = 360;

    onDayHover(day: CalendarMonthViewDay<Date>, element: HTMLElement): void {
        if (!isSameMonth(day.date, this.viewDate) || (day.events?.length ?? 0) === 0 || !this.calendarContainer) {
            this.hoverInfo = null;
            return;
        }

        const containerRect = this.calendarContainer.nativeElement.getBoundingClientRect();
        const cellRect = element.getBoundingClientRect();

        const top = cellRect.top - containerRect.top + cellRect.height / 2;
        let left = cellRect.left - containerRect.left + cellRect.width + 16;
        let side: 'right' | 'left' = 'right';

        if (left + this.painelLargura > containerRect.width) {
            left = cellRect.left - containerRect.left - this.painelLargura - 16;
            side = 'left';
        }

        if (left < 0) {
            left = Math.max(0, containerRect.width / 2 - this.painelLargura / 2);
        }

        this.hoverInfo = {
            date: day.date,
            formattedDate: format(day.date, "EEEE, d 'de' MMMM", { locale: ptBR }),
            events: day.events as CalendarEvent[],
            top,
            left,
            side
        };
    }

    limparHover(): void {
        this.hoverInfo = null;
    }

    mudarVisao(view: CalendarView): void {
        this.view = view;
        this.hoverInfo = null;
    }
}

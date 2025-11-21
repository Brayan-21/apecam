import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert.html',
    styleUrl: './alert.css'
})
export class Alert implements OnChanges, OnDestroy {
    @Input() type: AlertType = 'success';
    @Input() message: string = '';
    @Input() show: boolean = false;
    @Input() autoClose: boolean = false;
    @Input() autoCloseDelay: number = 5000; // 5 segundos por padrão
    @Output() closed = new EventEmitter<void>();

    private autoCloseTimeout: any;

    ngOnChanges(): void {
        if (this.show && this.autoClose) {
            this.startAutoClose();
        } else {
            this.clearAutoClose();
        }
    }

    ngOnDestroy(): void {
        this.clearAutoClose();
    }

    close(): void {
        this.show = false;
        this.clearAutoClose();
        this.closed.emit();
    }

    private startAutoClose(): void {
        this.clearAutoClose();
        this.autoCloseTimeout = setTimeout(() => {
            this.close();
        }, this.autoCloseDelay);
    }

    private clearAutoClose(): void {
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
            this.autoCloseTimeout = null;
        }
    }

    getIconName(): string {
        switch (this.type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            default:
                return 'info';
        }
    }
}


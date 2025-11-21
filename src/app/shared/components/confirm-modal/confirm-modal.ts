import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.html',
    styleUrl: './confirm-modal.css'
})
export class ConfirmModal {
    @Input() show: boolean = false;
    @Input() title: string = 'Confirmar ação';
    @Input() message: string = 'Tem certeza que deseja realizar esta ação?';
    @Input() confirmText: string = 'Confirmar';
    @Input() cancelText: string = 'Cancelar';
    @Input() type: 'danger' | 'warning' | 'info' = 'warning';
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    confirm(): void {
        this.confirmed.emit();
    }

    cancel(): void {
        this.cancelled.emit();
    }

    close(): void {
        this.cancelled.emit();
    }
}


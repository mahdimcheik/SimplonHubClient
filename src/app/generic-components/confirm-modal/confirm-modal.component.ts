import { Component, input, output, model, computed } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

export interface ConfirmModalData {
    title: string;
    question: string;
    confirmText?: string;
    cancelText?: string;
    severity?: 'info' | 'warning' | 'danger' | 'success';
    confirmButtonOnly?: boolean;
}

@Component({
    selector: 'app-confirm-modal',
    imports: [DialogModule, ButtonModule, CommonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
    // Inputs using signal-based API
    visible = model<boolean>(false);
    title = input<string>('Confirmation');
    question = input<string>('Are you sure you want to proceed?');
    confirmText = input<string>('Confirm');
    cancelText = input<string>('Cancel');
    severity = input<'info' | 'warning' | 'danger' | 'success'>('warning');
    confirmButtonOnly = input<boolean>(false);

    // Outputs using signal-based API
    onConfirm = output<void>();
    onCancel = output<void>();
    onClose = output<void>();

    // Computed properties for styling
    iconClass = computed(() => {
        switch (this.severity()) {
            case 'info':
                return 'pi pi-info-circle text-blue-500';
            case 'warning':
                return 'pi pi-exclamation-triangle text-yellow-500';
            case 'danger':
                return 'pi pi-times-circle text-red-500';
            case 'success':
                return 'pi pi-check-circle text-green-500';
            default:
                return 'pi pi-question-circle text-gray-500';
        }
    });

    containerClass = computed(() => {
        const baseClass = 'border-l-4 p-4 rounded-r-lg';
        switch (this.severity()) {
            case 'info':
                return `${baseClass} bg-blue-50 border-blue-400`;
            case 'warning':
                return `${baseClass} bg-yellow-50 border-yellow-400`;
            case 'danger':
                return `${baseClass} bg-red-50 border-red-400`;
            case 'success':
                return `${baseClass} bg-green-50 border-green-400`;
            default:
                return `${baseClass} bg-gray-50 border-gray-400`;
        }
    });

    confirmButtonClass = computed(() => {
        switch (this.severity()) {
            case 'info':
                return 'p-button-info';
            case 'warning':
                return 'p-button-warning';
            case 'danger':
                return 'p-button-danger';
            case 'success':
                return 'p-button-success';
            default:
                return 'p-button-primary';
        }
    });

    buttonSeverity = computed(() => {
        switch (this.severity()) {
            case 'danger':
                return 'danger' as const;
            case 'success':
                return 'success' as const;
            case 'info':
                return 'info' as const;
            default:
                return 'primary' as const;
        }
    });
    handleConfirm(): void {
        this.onConfirm.emit();
        this.close();
    }

    handleCancel(): void {
        this.onCancel.emit();
        this.close();
    }

    close(): void {
        this.visible.set(false);
        this.onClose.emit();
    }
}

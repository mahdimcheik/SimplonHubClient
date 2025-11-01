import { Component, computed, inject, input, model, output } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Slot } from '../../../api';
import { DatePipe } from '@angular/common';
import { Divider, DividerModule } from 'primeng/divider';
import { FormBuilder } from '@angular/forms';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
    selector: 'app-modal-quick-infos',
    imports: [BaseModalComponent, ButtonModule, DatePipe, DividerModule],
    templateUrl: './modal-quick-infos.component.html',
    styleUrl: './modal-quick-infos.component.scss'
})
export class ModalQuickInfosComponent {
    visible = model(false);
    event = model<EventInput | null>(null);
    isEditing = model(false);
    showSubmitButton = model(true);
    showCancelButton = model(true);
    showEditButton = model(false);
    isPassed = computed(() => {
        return new Date(this.slot()?.dateTo as Date) < new Date();
    });
    // datePipe = inject(DatePipe);

    // output
    onEdit = output<void>();
    onClose = output<void>();

    slot = computed<Slot | null>(() => {
        if (this.event()?.extendedProps && this.event()?.extendedProps?.['slot']) {
            return this.event()?.extendedProps?.['slot'];
        }
        return null;
    });
    title = computed(() => (this.slot() ? `Détails du créneau - ${new Date(this.slot()?.dateTo as Date).toLocaleDateString('fr-FR')}` : "Détails de l'événement"));

    close = () => {
        this.visible.set(false);
        this.onClose.emit();
    };

    onHide = () => {
        this.visible.set(false);
        this.onClose.emit();
    };

    edit() {
        this.isEditing.set(true);
        this.close();
        this.onEdit.emit();
    }
}

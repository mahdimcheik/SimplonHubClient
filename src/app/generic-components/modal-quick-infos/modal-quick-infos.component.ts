import { Component, computed, inject, input, model } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Slot } from '../../../api';
import { DatePipe } from '@angular/common';
import { Divider } from 'primeng/divider';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-modal-quick-infos',
    imports: [DialogModule, ButtonModule, DatePipe, Divider],
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

    slot = computed<Slot | null>(() => {
        if (this.event()?.extendedProps && this.event()?.extendedProps?.['slot']) {
            return this.event()?.extendedProps?.['slot'];
        }
        return null;
    });
    title = computed(() => (this.slot() ? `Détails du créneau - ${this.slot()?.dateTo}` : "Détails de l'événement"));

    close = () => {
        this.visible.set(false);
    };

    onHide = () => {
        this.visible.set(false);
    };

    edit() {
        this.isEditing.set(true);
        this.close();
    }
}

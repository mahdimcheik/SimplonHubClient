import { Component, computed, inject, linkedSignal, model, OnInit, output, signal } from '@angular/core';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { SlotResponseDTO, TypeSlotResponseDTO } from '../../../api';
import { SlotMainService } from '../../shared/services/slot-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-modal-book-unbook',
    imports: [BaseSideModalComponent, ConfigurableFormComponent, DatePipe, ButtonModule],
    templateUrl: './modal-book-unbook.html',
    styleUrl: './modal-book-unbook.scss'
})
export class ModalBookUnbookComponent implements OnInit {
    fb = inject(FormBuilder);
    slotMainService = inject(SlotMainService);
    userMainService = inject(UserMainService);
    messageService = inject(MessageService);

    user = this.userMainService.userConnected;
    event = model<EventInput | null>(null);
    visible = model(false);
    title = computed(() => (this.event()?.extendedProps?.['slot'] ? 'Réserver ce créneau' : 'Désinscrire de ce créneau'));
    slot = linkedSignal<SlotResponseDTO | null>(() => {
        const slot = this.event()?.extendedProps?.['slot'];
        if (slot) {
            return slot;
        }
        return null;
    });

    isBooked = linkedSignal<boolean>(() => {
        return !!this.slot()?.booking?.student?.id;
    });
    ispassed = computed(() => {
        return new Date(this.slot()?.dateFrom!) < new Date();
    });

    start = computed(() => {
        const event = this.event();
        if (!event?.start) return null;
        return event.start instanceof Date ? event.start : new Date(event?.start as string);
    });

    end = computed(() => {
        const event = this.event();
        if (!event?.end) return null;

        return event.end instanceof Date ? event.end : new Date(event?.end as string);
    });

    typeId = computed(() => {
        return this.slot()?.typeId ?? '';
    });

    form = computed<Structure>(() => {
        return {
            id: 'slot',
            name: '',
            label: '',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: 'Informations',
                    label: 'Informations',
                    fields: [
                        { id: 'title', label: 'Titre', name: 'title', type: 'text', required: true, value: this.slot()?.booking?.title, fullWidth: true },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: this.slot()?.booking?.description, fullWidth: true }
                    ]
                }
            ]
        };
    });

    typesSlot = signal<TypeSlotResponseDTO[]>([]);

    // output
    onExit = output<void>();

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        const types = await this.slotMainService.getTypeSlot();
        this.typesSlot.set(types);
    }

    async submit(event: FormGroup) {
        try {
            if (!this.slot()?.booking) {
                await this.slotMainService.bookSlot({
                    ...event.value.informations,
                    studentId: this.user()?.id ?? '',
                    slotId: this.slot()?.id ?? ''
                });
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau reservé avec succès' });
                this.visible.set(false);
            } else {
                this.visible.set(false);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau désinscrit avec succès' });
            }
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la réservation du créneau.' });
        } finally {
            this.cancel();
        }
    }

    cancel() {
        this.visible.set(false);
        this.onExit.emit();
    }
}

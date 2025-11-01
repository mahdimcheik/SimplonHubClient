import { Component, computed, inject, linkedSignal, model, OnInit, output, signal } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { SlotResponseDTO, TypeSlotResponseDTO } from '../../../api';
import { SlotMainService } from '../../shared/services/slot-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-modal-create-edit-slot',
    imports: [BaseSideModalComponent, ConfigurableFormComponent, DatePipe],
    templateUrl: './modal-create-edit-slot.component.html',
    styleUrl: './modal-create-edit-slot.component.scss'
})
export class ModalCreateEditSlotComponent implements OnInit {
    fb = inject(FormBuilder);
    slotMainService = inject(SlotMainService);
    userMainService = inject(UserMainService);
    messageService = inject(MessageService);

    user = this.userMainService.userConnected;
    event = model<EventInput | null>(null);
    visible = model(false);
    title = computed(() => (this.event()?.extendedProps?.['slot'] ? "Modification d'un créneau" : "Création d'un créneau"));
    slot = linkedSignal<SlotResponseDTO | null>(() => {
        const slot = this.event()?.extendedProps?.['slot'];
        if (slot) {
            return slot;
        }
        return null;
    });
    start = computed(() => {
        const event = this.event();
        if (!event?.start) return null;
        return event.start instanceof Date ? event.start : new Date(event?.start as string);
    });
    end = computed(() => {
        const event = this.event();
        if (!event?.end) return null;
        console.log('end', new Date(event?.end as string));

        return event.end instanceof Date ? event.end : new Date(event?.end as string);
    });

    typeId = computed(() => {
        return this.slot()?.typeId ?? '';
    });

    form = computed<Structure>(() => {
        return {
            id: 'slot',
            name: 'Créneau',
            label: 'Créneau',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: 'Informations',
                    label: 'Informations',
                    fields: [
                        { id: 'dateFrom', label: 'Date de début', name: 'dateFrom', type: 'date', value: this.start(), showTime: true, fullWidth: true, timeOnly: true },
                        { id: 'dateTo', label: 'Date de fin', name: 'dateTo', type: 'date', value: this.end(), showTime: true, required: true, fullWidth: true, timeOnly: true },
                        { id: 'typeId', label: 'Type', name: 'typeId', type: 'select', options: this.typesSlot(), required: true, compareKey: 'id', displayKey: 'name', value: this.typeId(), fullWidth: true }
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
            if (!this.slot()) {
                const slot = await this.slotMainService.createSlot({
                    ...event.value.informations,
                    teacherId: this.user()?.id ?? ''
                });
                this.visible.set(false);
                this.slotMainService.slots.update((current) => [...current, slot!]);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau créé avec succès' });
            } else {
                const slot = await this.slotMainService.updateSlot(this.slot()?.id ?? '', {
                    ...event.value.informations,
                    teacherId: this.user()?.id ?? ''
                });
                this.visible.set(false);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Créneau mis à jour avec succès' });
            }
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du créneau.' });
        } finally {
            this.cancel();
        }
    }

    cancel() {
        this.visible.set(false);
        this.onExit.emit();
    }
}

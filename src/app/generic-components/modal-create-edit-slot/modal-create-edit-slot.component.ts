import { Component, computed, inject, linkedSignal, model, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DrawerModule } from 'primeng/drawer';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { SlotResponseDTO } from '../../../api';

@Component({
    selector: 'app-modal-create-edit-slot',
    imports: [DialogModule, ConfigurableFormComponent, DrawerModule],
    templateUrl: './modal-create-edit-slot.component.html',
    styleUrl: './modal-create-edit-slot.component.scss'
})
export class ModalCreateEditSlotComponent implements OnInit {
    fb = inject(FormBuilder);

    event = model<EventInput | null>(null);
    visible = model(false);
    title = computed(() => (this.event() ? "Modification d'un créneau" : "Création d'un créneau"));
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
                        { id: 'start', label: 'Date de début', name: 'start', type: 'date', value: this.start(), showTime: true, fullWidth: true, timeOnly: true },
                        { id: 'end', label: 'Date de fin', name: 'end', type: 'date', value: this.end(), showTime: true, required: true, fullWidth: true, timeOnly: true },
                        { id: 'typeId', label: 'Type', name: 'typeId', type: 'select', options: this.getTypes(), required: true, compareKey: 'id', displayKey: 'name', value: this.slot()?.typeId, fullWidth: true }
                    ]
                }
            ]
        };
    });

    ngOnInit(): void {
        console.log('Event:', this.event());
        console.log('Start Date:', this.start());
        console.log('End Date:', this.end());
        console.log('Start type:', typeof this.start());
        console.log('End type:', typeof this.end());
        console.log('Form structure:', this.form());
    }

    getTypes() {
        return [
            { id: '1', name: 'Type 1' },
            { id: '2', name: 'Type 2' },
            { id: '3', name: 'Type 3' }
        ];
    }

    submit(event: FormGroup) {
        console.log(event.value);
    }

    cancel() {
        this.visible.set(false);
    }
}

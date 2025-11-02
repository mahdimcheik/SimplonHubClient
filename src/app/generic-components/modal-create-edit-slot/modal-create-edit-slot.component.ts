import { Component, computed, inject, linkedSignal, model, OnInit, output, signal } from '@angular/core';
import { DateInput, EventInput } from '@fullcalendar/core/index.js';
import { FormGroup, FormsModule } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { SlotResponseDTO, TypeSlotResponseDTO } from '../../../api';
import { SlotMainService } from '../../shared/services/slot-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-modal-create-edit-slot',
    imports: [BaseSideModalComponent, ConfigurableFormComponent, DatePipe, ButtonModule, ConfirmModalComponent, CheckboxModule, FormsModule, CommonModule],
    templateUrl: './modal-create-edit-slot.component.html',
    styleUrl: './modal-create-edit-slot.component.scss'
})
export class ModalCreateEditSlotComponent implements OnInit {
    private readonly slotMainService = inject(SlotMainService);
    private readonly userMainService = inject(UserMainService);
    private readonly messageService = inject(MessageService);

    // Confirmation dialogs
    readonly showDeleteConfirm = signal(false);
    readonly showRejectConfirm = signal(false);
    readonly deleteSlotAndReservation = signal<boolean>(false);

    // Modal state
    readonly event = model<EventInput | null>(null);
    readonly visible = model(false);

    // Computed properties
    readonly user = this.userMainService.userConnected;
    readonly slot = linkedSignal<SlotResponseDTO | null>(() => this.event()?.extendedProps?.['slot'] ?? null);
    readonly isEditMode = computed(() => !!this.slot());
    readonly title = computed(() => (this.isEditMode() ? "Modification d'un créneau" : "Création d'un créneau"));
    readonly hasBooking = computed(() => !!this.slot()?.booking?.student?.id);
    readonly bookingStatus = computed(() => this.slot()?.booking?.status?.name);

    // Date computeds
    readonly start = computed(() => this.parseEventDate(this.event()?.start));
    readonly end = computed(() => this.parseEventDate(this.event()?.end));
    readonly typeId = computed(() => this.slot()?.typeId ?? '');

    // Form data
    readonly typesSlot = signal<TypeSlotResponseDTO[]>([]);

    // Form structure
    readonly form = computed<Structure>(() => ({
        id: 'slot',
        name: 'Créneau',
        label: 'Créneau',
        submitButtonLabel: this.isEditMode() ? 'Editer' : 'Créer',
        formFieldGroups: [
            {
                id: 'informations',
                name: 'Informations',
                label: 'Informations',
                fields: [
                    {
                        id: 'dateFrom',
                        label: 'Date de début',
                        name: 'dateFrom',
                        type: 'date',
                        value: this.start(),
                        showTime: true,
                        fullWidth: true,
                        timeOnly: true
                    },
                    {
                        id: 'dateTo',
                        label: 'Date de fin',
                        name: 'dateTo',
                        type: 'date',
                        value: this.end(),
                        showTime: true,
                        required: true,
                        fullWidth: true,
                        timeOnly: true
                    },
                    {
                        id: 'typeId',
                        label: 'Type',
                        name: 'typeId',
                        type: 'select',
                        options: this.typesSlot(),
                        required: true,
                        compareKey: 'id',
                        displayKey: 'name',
                        value: this.typeId(),
                        fullWidth: true
                    }
                ]
            }
        ]
    }));

    // Outputs
    readonly onExit = output<void>();

    ngOnInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        const types = await this.slotMainService.getTypeSlot();
        this.typesSlot.set(types);
    }

    private parseEventDate(date: DateInput | undefined | null): Date | null {
        if (!date) return null;
        if (date instanceof Date) return date;
        if (Array.isArray(date)) return new Date(...(date as [number, number, number]));
        return new Date(date);
    }

    private getSlotId(): string {
        return this.slot()?.id ?? '';
    }

    private getBookingId(): string {
        return this.slot()?.booking?.id ?? '';
    }

    private getUserId(): string {
        return this.user()?.id ?? '';
    }

    private closeModal(): void {
        this.visible.set(false);
        this.onExit.emit();
    }

    private showSuccess(detail: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail
        });
    }

    private showError(detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail
        });
    }

    async submit(event: FormGroup): Promise<void> {
        try {
            const formData = {
                ...event.value.informations,
                teacherId: this.getUserId()
            };

            if (this.isEditMode()) {
                await this.slotMainService.updateSlot(this.getSlotId(), formData);
                this.showSuccess('Créneau mis à jour avec succès');
            } else {
                const slot = await this.slotMainService.createSlot(formData);
                this.slotMainService.slots.update((current) => [...current, slot!]);
                this.showSuccess('Créneau créé avec succès');
            }
        } catch (error) {
            const action = this.isEditMode() ? 'la mise à jour' : 'la création';
            this.showError(`Une erreur est survenue lors de ${action} du créneau.`);
        } finally {
            this.closeModal();
        }
    }

    async deleteSlot(): Promise<void> {
        try {
            await this.slotMainService.deleteSlot(this.getSlotId());
            this.showSuccess('Créneau supprimé avec succès');
        } catch (error) {
            this.showError('Une erreur est survenue lors de la suppression du créneau.');
        } finally {
            this.showDeleteConfirm.set(false);
            this.closeModal();
        }
    }

    async acceptBooking(): Promise<void> {
        try {
            await this.slotMainService.confirmBooking(this.getBookingId());
            this.showSuccess('Réservation acceptée avec succès');
        } catch (error) {
            this.showError("Une erreur est survenue lors de l'acceptation de la réservation.");
        } finally {
            this.closeModal();
        }
    }

    async rejectBooking(): Promise<void> {
        try {
            if (this.deleteSlotAndReservation()) {
                await this.slotMainService.deleteSlot(this.getSlotId(), true);
                this.showSuccess('Créneau et réservation supprimés avec succès');
            } else {
                await this.slotMainService.deleteBooking(this.getBookingId());
                this.showSuccess('Réservation rejetée avec succès');
            }
        } catch (error) {
            this.showError('Une erreur est survenue lors du rejet de la réservation.');
        } finally {
            this.showRejectConfirm.set(false);
            this.deleteSlotAndReservation.set(false);
            this.closeModal();
        }
    }

    cancel(): void {
        this.closeModal();
    }
}

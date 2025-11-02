import { Component, computed, inject, linkedSignal, model, OnInit, output, signal } from '@angular/core';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { BookingUpdateDTO, SlotResponseDTO } from '../../../api';
import { SlotMainService } from '../../shared/services/slot-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-modal-book-unbook',
    imports: [BaseSideModalComponent, ConfigurableFormComponent, DatePipe, ButtonModule, ConfirmModalComponent],
    templateUrl: './modal-book-unbook.html',
    styleUrl: './modal-book-unbook.scss'
})
export class ModalBookUnbookComponent {
    private readonly slotMainService = inject(SlotMainService);
    private readonly userMainService = inject(UserMainService);
    private readonly messageService = inject(MessageService);

    // Modal state
    readonly event = model<EventInput | null>(null);
    readonly visible = model(false);
    showDeleteModal = signal(false);

    // Computed properties
    readonly user = this.userMainService.userConnected;
    readonly slot = linkedSignal<SlotResponseDTO | null>(() => this.event()?.extendedProps?.['slot'] ?? null);
    readonly isBooked = linkedSignal<boolean>(() => !!this.slot()?.booking?.student?.id);
    readonly isPassed = computed(() => {
        const dateFrom = this.slot()?.dateFrom;
        return dateFrom ? new Date(dateFrom) < new Date() : false;
    });
    readonly isOwnBooking = computed(() => this.slot()?.booking?.student?.id === this.user()?.id);
    readonly canEditBooking = computed(() => !this.isPassed() && (!this.isBooked() || this.isOwnBooking()));

    // Title and form
    readonly title = computed(() => (this.isBooked() ? 'Modifier la réservation' : 'Réserver ce créneau'));
    readonly submitButtonTitle = computed(() => (this.isBooked() ? 'Modifier' : 'Réserver'));

    readonly form = computed<Structure>(() => ({
        id: 'slot',
        name: '',
        label: '',
        submitButtonLabel: this.submitButtonTitle(),
        formFieldGroups: [
            {
                id: 'informations',
                name: 'Informations',
                label: 'Informations',
                fields: [
                    {
                        id: 'title',
                        label: 'Titre',
                        name: 'title',
                        type: 'text',
                        required: true,
                        value: this.slot()?.booking?.title,
                        fullWidth: true
                    },
                    {
                        id: 'description',
                        label: 'Description',
                        name: 'description',
                        type: 'textarea',
                        required: true,
                        value: this.slot()?.booking?.description,
                        fullWidth: true
                    }
                ]
            }
        ]
    }));

    // Outputs
    readonly onExit = output<void>();

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
            const formData = event.value.informations;

            if (this.isBooked()) {
                await this.updateBooking({
                    id: this.getBookingId(),
                    ...formData
                });
                this.showSuccess('Réservation mise à jour avec succès');
            } else {
                await this.slotMainService.bookSlot({
                    ...formData,
                    studentId: this.getUserId(),
                    slotId: this.getSlotId()
                });
                this.showSuccess('Créneau réservé avec succès');
            }
        } catch (error) {
            const action = this.isBooked() ? 'la mise à jour' : 'la réservation';
            this.showError(`Une erreur est survenue lors de ${action} du créneau.`);
        } finally {
            this.closeModal();
        }
    }

    private async updateBooking(bookingData: BookingUpdateDTO): Promise<void> {
        await this.slotMainService.updateBooking(bookingData);
    }

    async unbook(): Promise<void> {
        try {
            await this.slotMainService.unbookSlot(this.getBookingId());
            this.showSuccess('Réservation annulée avec succès');
        } catch (error) {
            this.showError("Une erreur est survenue lors de l'annulation de la réservation.");
        } finally {
            this.closeModal();
        }
    }

    cancel(): void {
        this.closeModal();
    }
}

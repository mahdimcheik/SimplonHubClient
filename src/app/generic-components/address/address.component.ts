import { Component, inject, model, signal } from '@angular/core';
import { SmartElementComponent } from '../smart-element/smart-element.component';
import { AddressResponseDTO } from '../../../api';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AddressesMainService } from '../../shared/services/addresses-main.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-address',
    imports: [SmartElementComponent, ModalAddressComponent, ConfirmModalComponent],
    templateUrl: './address.component.html',
    styleUrl: './address.component.scss'
})
export class AddressComponent {
    editMode = model(false);
    addressMainService = inject(AddressesMainService);
    messageService = inject(MessageService);

    address = model.required<AddressResponseDTO>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }

    async deleteAddress() {
        this.showDeleteConfirm.set(true);
    }

    submit(event: any) {
        console.log(event);
        this.showEditModal.set(false);
    }

    async confirmDelete(confirmed: boolean) {
        if (confirmed) {
            try {
                await this.addressMainService.deleteAddress(this.address().id);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Adresse supprimée avec succès' });
            } catch (error) {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression' });
            } finally {
                this.showDeleteConfirm.set(false);
            }
        } else {
            this.showDeleteConfirm.set(false);
            this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' });
        }
    }
}

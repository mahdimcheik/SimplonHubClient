import { Component, computed, inject, model } from '@angular/core';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { AddressesMainService } from '../../shared/services/addresses-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { AddressCreateDTO, AddressResponseDTO } from '../../../api';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';

@Component({
    selector: 'app-modal-address',
    imports: [BaseSideModalComponent, ConfigurableFormComponent],
    templateUrl: './modal-address.component.html',
    styleUrl: './modal-address.component.scss'
})
export class ModalAddressComponent {
    addressService = inject(AddressesMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);

    title = model('Gestion des Adresses');
    showEditModal = model(false);
    addressInput = model<AddressResponseDTO>({} as AddressResponseDTO);

    addresses = this.addressService.addresses;

    addressForm = computed<Structure>(() => {
        return {
            id: 'address',
            name: 'Adresse',
            label: 'Adresse',
            formFieldGroups: [
                {
                    id: 'informations',
                    label: "Informations de l'adresse",
                    name: "Informations de l'adresse",
                    fields: [
                        { id: 'street', label: 'Rue', name: 'street', type: 'text', required: true, value: this.addressInput()?.street, fullWidth: true },
                        { id: 'city', label: 'Ville', name: 'city', type: 'text', required: true, value: this.addressInput()?.city },
                        { id: 'state', label: 'État/Province', name: 'state', type: 'text', required: true, value: this.addressInput()?.state },
                        { id: 'country', label: 'Pays', name: 'country', type: 'text', required: true, value: this.addressInput()?.country },
                        { id: 'zipCode', label: 'Code postal', name: 'zipCode', type: 'text', required: true, value: this.addressInput()?.zipCode },
                        { id: 'additionalInfo', label: 'Informations supplémentaires', name: 'additionalInfo', type: 'textarea', required: false, value: this.addressInput()?.additionalInfo }
                    ]
                }
            ]
        };
    });

    async openModal() {
        this.showEditModal.set(true);
    }

    cancel() {
        this.showEditModal.set(false);
    }

    async submit(address: FormGroup) {
        try {
            if (this.addressInput() && this.addressInput()?.id) {
                await this.addressService.updateAddress(this.addressInput()?.id as string, { ...address.value?.informations, userId: this.user().id } as AddressCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Adresse mise à jour avec succès' });
            } else {
                await this.addressService.createAddress({ ...address.value?.informations, userId: this.user().id } as AddressCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Adresse créée avec succès' });
            }
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Une erreur est survenue lors de la gestion de l'adresse." });
        } finally {
            this.showEditModal.set(false);
        }
    }
}

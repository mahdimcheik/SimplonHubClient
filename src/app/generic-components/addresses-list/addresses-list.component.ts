import { Component, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
import { AddressResponseDTO } from '../../../api';
import { SmartSectionComponent } from '../smart-section/smart-section.component';
import { AddressComponent } from '../address/address.component';
import { AddressesMainService } from '../../shared/services/addresses-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { ModalAddressComponent } from '../modal-address/modal-address.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-addresses-list',
    imports: [SmartSectionComponent, AddressComponent, ModalAddressComponent],
    templateUrl: './addresses-list.component.html',
    styleUrl: './addresses-list.component.scss'
})
export class AddressesListComponent implements OnInit {
    addressService = inject(AddressesMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    title = 'Liste des Adresses';

    editMode = model(true);
    buttonIcon = model('pi pi-plus');
    showEditModal = signal(false);

    addresses = this.addressService.addresses;

    async ngOnInit() {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            if (teacherId && teacherId === 'me') {
                this.editMode.set(true);
                this.addressService.getAllAddressesByUser(this.user().id).then((addresses) => {
                    this.addresses.set(addresses);
                    return addresses;
                });
            } else {
                this.editMode.set(false);
                this.addressService.getAllAddressesByUser(teacherId).then((addresses) => {
                    this.addresses.set(addresses);
                    return addresses;
                });
            }
        });
    }

    async openModal() {
        this.showEditModal.set(true);
    }

    cancel() {
        this.showEditModal.set(false);
    }
}

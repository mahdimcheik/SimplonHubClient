import { Component, inject, model, signal } from '@angular/core';
import { SmartElementComponent } from '../smart-element/smart-element.component';
import { DatePipe } from '@angular/common';
import { Address, Cursus, CursusResponseDTO } from '../../../api';
import { ModalCursusComponent } from '../modal-cursus/modal-cursus.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CursusesMainService } from '../../shared/services/cursuses-main.service';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-cursus',
    imports: [SmartElementComponent, ModalCursusComponent, ConfirmModalComponent],
    templateUrl: './cursus.component.html',
    styleUrl: './cursus.component.scss'
})
export class CursusComponent {
    cursusMainService = inject(CursusesMainService);
    messageService = inject(MessageService);

    editMode = model(false);
    cursus = model.required<CursusResponseDTO>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }
    async deleteCursus() {
        this.showDeleteConfirm.set(true);
    }
    submit(event: any) {
        console.log(event);
        this.showEditModal.set(false);
    }
    async confirmDelete(confirmed: boolean) {
        if (confirmed) {
            try {
                await this.cursusMainService.deleteCursus(this.cursus().id);
            } catch (error) {
            } finally {
                this.showDeleteConfirm.set(false);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cursus supprimé avec succès' });
            }
        } else {
            this.showDeleteConfirm.set(false);
            this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' });
        }
    }
}

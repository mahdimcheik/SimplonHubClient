import { Component, inject, model, signal } from '@angular/core';
import { SmartElementComponent } from '../smart-element/smart-element.component';
import { DatePipe } from '@angular/common';
import { FormationResponseDTO } from '../../../api';
import { ModalFormationComponent } from '../modal-formation/modal-formation.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormationsMainService } from '../../shared/services/formations-main.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-formation',
    imports: [SmartElementComponent, DatePipe, ModalFormationComponent, ConfirmModalComponent],
    templateUrl: './formation.component.html',
    styleUrl: './formation.component.scss'
})
export class FormationComponent {
    editMode = model(false);
    formationMainService = inject(FormationsMainService);
    messageService = inject(MessageService);

    formation = model.required<FormationResponseDTO>();
    showEditModal = signal(false);
    showDeleteConfirm = signal(false);

    cancel() {
        this.showEditModal.set(false);
    }

    openEditModal() {
        this.showEditModal.set(true);
    }

    async deleteFormation() {
        this.showDeleteConfirm.set(true);
    }

    submit(event: any) {
        console.log(event);
        this.showEditModal.set(false);
    }

    async confirmDelete(confirmed: boolean) {
        if (confirmed) {
            try {
                await this.formationMainService.deleteFormation(this.formation().id);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formation supprimée avec succès' });
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

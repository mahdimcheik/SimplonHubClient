import { Component, computed, inject, model, signal } from '@angular/core';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DialogModule } from 'primeng/dialog';
import { FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { FormationsMainService } from '../../shared/services/formations-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { FormationCreateDTO, FormationResponseDTO } from '../../../api';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-modal-formation',
    imports: [DialogModule, ConfigurableFormComponent, DrawerModule],
    templateUrl: './modal-formation.component.html',
    styleUrl: './modal-formation.component.scss'
})
export class ModalFormationComponent {
    formationService = inject(FormationsMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);

    title = model('Gestion des Formations');
    showEditModal = model(false);
    formationInput = model<FormationResponseDTO>({} as FormationResponseDTO);

    formationForm = computed<Structure>(() => {
        if (this.formationInput() && this.formationInput()?.id) {
            return {
                id: 'formation',
                name: 'Formation',
                label: 'Formation',
                formFieldGroups: [
                    {
                        id: 'informations',
                        name: 'Informations de la formation',
                        label: 'Informations de la formation',
                        fields: [
                            { id: 'title', label: 'Titre', name: 'title', type: 'text', required: true, value: this.formationInput()?.title },
                            { id: 'institution', label: 'Institution', name: 'institution', type: 'text', required: true, value: this.formationInput()?.institution },
                            { id: 'dateFrom', label: 'Date de début', name: 'dateFrom', type: 'date', required: true, value: this.formationInput()?.dateFrom ? new Date(this.formationInput()?.dateFrom) : null },
                            { id: 'dateTo', label: 'Date de fin', name: 'dateTo', type: 'date', required: false, value: this.formationInput()?.dateTo ? new Date(this.formationInput()?.dateTo ?? '') : null },
                            { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: this.formationInput()?.description }
                        ]
                    }
                ]
            };
        } else {
            return {
                id: 'formation',
                name: 'Formation',
                label: 'Formation',
                formFieldGroups: [
                    {
                        id: 'informations',
                        name: 'Informations de la formation',
                        label: 'Informations de la formation',
                        fields: [
                            { id: 'title', label: 'Titre', name: 'title', type: 'text', required: true, value: null },
                            { id: 'institution', label: 'Institution', name: 'institution', type: 'text', required: true, value: null },
                            { id: 'dateFrom', label: 'Date de début', name: 'dateFrom', type: 'date', required: true, value: null },
                            { id: 'dateTo', label: 'Date de fin', name: 'dateTo', type: 'date', required: false, value: undefined },
                            { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: null }
                        ]
                    }
                ]
            };
        }
    });

    async openModal() {
        this.showEditModal.set(true);
    }

    cancel() {
        this.showEditModal.set(false);
    }

    async submit(formation: FormGroup) {
        try {
            if (!formation.value?.informations.dateTo) {
                formation.value.informations.dateTo = undefined;
            }
            if (this.formationInput() && this.formationInput()?.id) {
                await this.formationService.updateFormation(this.formationInput()?.id as string, { ...formation.value?.informations, userId: this.user().id } as FormationCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formation mise à jour avec succès' });
            } else {
                await this.formationService.createFormation({ ...formation.value?.informations, userId: this.user().id } as FormationCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formation créée avec succès' });
            }
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la gestion de la formation.' });
        } finally {
            this.showEditModal.set(false);
        }
    }
}

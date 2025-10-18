import { Component, computed, inject, model, signal } from '@angular/core';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { Drawer } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { CursusesMainService } from '../../shared/services/cursuses-main.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { MessageService } from 'primeng/api';
import { CursusCreateDTO, CursusResponseDTO } from '../../../api';

@Component({
    selector: 'app-modal-cursus',
    imports: [Drawer, DialogModule, ConfigurableFormComponent],
    templateUrl: './modal-cursus.component.html',
    styleUrl: './modal-cursus.component.scss'
})
export class ModalCursusComponent {
    cursusService = inject(CursusesMainService);
    user = inject(UserMainService).userConnected;
    messageService = inject(MessageService);

    title = model('Listes des Coursus');
    showEditModal = model(false);
    cursusInput = model<CursusResponseDTO>({} as CursusResponseDTO);

    // cursuses = this.cursusService.cursuses;
    allCategories = this.cursusService.allCategories;
    allLevels = this.cursusService.allLevels;

    cursusForm = computed<Structure>(() => {
        const _ = this.allCategories();
        const __ = this.allLevels();
        return {
            id: 'cursus',
            name: 'Cursus',
            label: 'Cursus',
            formFieldGroups: [
                {
                    id: 'informations',
                    label: 'Informations',
                    name: 'informations',
                    fields: [
                        { id: 'name', label: 'Titre', name: 'name', type: 'text', required: true, value: this.cursusInput()?.name },
                        { id: 'color', label: 'Couleur', name: 'color', type: 'color', required: true, value: this.cursusInput()?.color },
                        { id: 'levelId', label: 'Niveau', name: 'levelId', type: 'select', options: this.allLevels(), required: true, compareKey: 'id', displayKey: 'name', value: this.cursusInput()?.levelId },
                        {
                            id: 'categoryIds',
                            label: 'Catégorie',
                            name: 'categoryIds',
                            type: 'multiselect',
                            options: this.allCategories(),
                            required: true,
                            compareKey: 'id',
                            displayKey: 'name',
                            value: this.cursusInput()?.categories?.map((c) => c.id) ?? []
                        },
                        { id: 'description', label: 'Description', name: 'description', type: 'textarea', required: true, value: this.cursusInput()?.description }
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

    async submit(cursus: FormGroup) {
        try {
            if (this.cursusInput() && this.cursusInput()?.id) {
                await this.cursusService.updateCursus(this.cursusInput()?.id as string, { ...cursus.value?.informations, teacherId: this.user().id } as CursusCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cursus mis à jour avec succès' });
            } else {
                await this.cursusService.createCursus({ ...cursus.value?.informations, teacherId: this.user().id } as CursusCreateDTO);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Cursus créé avec succès' });
            }
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du cursus.' });
        } finally {
            this.showEditModal.set(false);
        }
    }
}

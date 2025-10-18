import { Component, computed, inject, linkedSignal, model, OnInit, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DrawerModule } from 'primeng/drawer';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { LanguageCreateDTO, LanguageResponseDTO, LanguageUpdateDTO, RoleAppResponseDTO, RoleAppUpdateDTO, SlotResponseDTO, StatusAccountCreateDTO, StatusAccountResponseDTO, StatusAccountUpdateDTO } from '../../../api';
import { LanguagesMainService } from '../../shared/services/languages.store.service';
import { MessageService } from 'primeng/api';
import { UserMainService } from '../../shared/services/userMain.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-modal-create-edit-status',
    imports: [DialogModule, ConfigurableFormComponent, DrawerModule],
    templateUrl: './modal-create-edit-status.html',
    styleUrl: './modal-create-edit-status.scss'
})
export class ModalCreateEditStatusComponent implements OnInit {
    fb = inject(FormBuilder);
    userService = inject(UserMainService);
    messageService = inject(MessageService);

    status = model<StatusAccountResponseDTO | null>(null);
    visible = model(false);
    title = computed(() => (this.status() ? "Modification d'un statut" : "Création d'un statut"));

    onSubmit = output();

    form = computed<Structure>(() => {
        return {
            id: 'status',
            name: 'Statut',
            label: 'Statut',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: 'Informations',
                    label: 'Informations',
                    fields: [
                        { id: 'name', label: 'Nom', name: 'name', type: 'text', value: this.status()?.name, required: true, fullWidth: true },
                        { id: 'color', label: 'Couleur', name: 'color', type: 'color', value: this.status()?.color, required: true, fullWidth: true }
                        // { id: 'icon', label: 'Icône', name: 'icon', type: 'text', value: this.language()?.icon, required: false, fullWidth: true }
                    ]
                }
            ]
        };
    });

    ngOnInit(): void {}

    getTypes() {}

    async submit(event: FormGroup) {
        try {
            if (this.status()) {
                var newStatus: StatusAccountUpdateDTO = {
                    ...this.status()!,
                    name: event.value.informations.name,
                    color: event.value.informations.color
                };
                await firstValueFrom(this.userService.UpdateStatus(this.status()!.id, newStatus));
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Statut mise à jour avec succès' });
                this.onSubmit.emit();
            } else {
                var newStatus: StatusAccountCreateDTO = {
                    name: event.value.informations.name,
                    color: event.value.informations.color
                };
                await firstValueFrom(this.userService.CreateStatus(newStatus));
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Statut créé avec succès' });
                this.onSubmit.emit();
            }
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la gestion de la langue.' });
        } finally {
            this.cancel();
        }
    }

    cancel() {
        this.visible.set(false);
    }
}

import { Component, computed, inject, linkedSignal, model, OnInit, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { DrawerModule } from 'primeng/drawer';
import { EventInput } from '@fullcalendar/core/index.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Structure } from '../configurable-form/related-models';
import { LanguageCreateDTO, LanguageResponseDTO, LanguageUpdateDTO, SlotResponseDTO } from '../../../api';
import { LanguagesMainService } from '../../shared/services/languages.store.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-modal-create-language',
    imports: [DialogModule, ConfigurableFormComponent, DrawerModule],
    templateUrl: './modal-create-edit-language.html',
    styleUrl: './modal-create-edit-language.scss'
})
export class ModalCreateEditLanguageComponent implements OnInit {
    fb = inject(FormBuilder);
    languageService = inject(LanguagesMainService);
    messageService = inject(MessageService);

    language = model<LanguageResponseDTO | null>(null);
    visible = model(false);
    title = computed(() => (this.language() ? "Modification d'une langue" : "Création d'une langue"));

    onSubmit = output();

    form = computed<Structure>(() => {
        return {
            id: 'language',
            name: 'Langue',
            label: 'Langue',
            formFieldGroups: [
                {
                    id: 'informations',
                    name: 'Informations',
                    label: 'Informations',
                    fields: [
                        { id: 'name', label: 'Nom', name: 'name', type: 'text', value: this.language()?.name, required: true, fullWidth: true },
                        { id: 'color', label: 'Couleur', name: 'color', type: 'color', value: this.language()?.color, required: true, fullWidth: true }
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
            if (this.language()) {
                await this.languageService.updateLanguage(this.language()!.id, event.value.informations as LanguageUpdateDTO);
            } else {
                await this.languageService.createLanguage(event.value.informations as LanguageCreateDTO);
            }
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Langue mise à jour avec succès' });
            this.onSubmit.emit();
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

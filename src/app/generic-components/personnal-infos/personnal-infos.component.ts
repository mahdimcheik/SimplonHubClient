import { TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, linkedSignal, model, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Image } from 'primeng/image';
import { firstValueFrom } from 'rxjs';
import { UserResponseDTO, UserUpdateDTO } from '../../../api';
import { CursusesMainService } from '../../shared/services/cursuses-main.service';
import { LanguagesMainService } from '../../shared/services/languages.store.service';
import { UserMainService } from '../../shared/services/userMain.service';
import { BaseSideModalComponent } from '../base-side-modal/base-side-modal.component';
import { ChipsListComponent } from '../chips-list/chips-list.component';
import { ConfigurableFormComponent } from '../configurable-form/configurable-form.component';
import { Structure } from '../configurable-form/related-models';
import { SmartSectionComponent } from '../smart-section/smart-section.component';

@Component({
    selector: 'app-personnal-infos',
    imports: [SmartSectionComponent, Image, BaseSideModalComponent, ConfigurableFormComponent, ChipsListComponent, TitleCasePipe],
    templateUrl: './personnal-infos.component.html',
    styleUrl: './personnal-infos.component.scss'
})
export class PersonnalInfosComponent implements OnInit {
    languagesService = inject(LanguagesMainService);
    userservice = inject(UserMainService);
    messageService = inject(MessageService);
    cursusService = inject(CursusesMainService);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    user = signal<UserResponseDTO>({} as UserResponseDTO);
    programmingLanguages = this.languagesService.programmingLanguages;
    languages = this.languagesService.languages;
    editMode = model(false);
    userId = signal<string>(this.userservice.userConnected().id);
    roles = computed(() =>
        this.user()
            .roles?.map((role) => role.displayName)
            .join(', ')
    );

    // options pour les multiselects
    languagesOptions = this.languagesService.allLanguages;
    programmingLanguagesOptions = this.languagesService.allProgrammingLanguages;

    personnalInfosFormConfig = linkedSignal<Structure>(() => {
        const languagesOptions = this.languagesOptions();
        const programmingLanguagesOptions = this.programmingLanguagesOptions();

        return {
            id: 'personnalInfos',
            name: 'personnalInfos',
            label: 'Informations personnelles',
            description: 'Veuillez remplir les champs obligatoires',

            formFieldGroups: [
                {
                    id: 'personnalInfos',
                    name: 'personnalInfos',
                    label: 'Informations personnelles',
                    description: 'Veuillez remplir les champs obligatoires',
                    fields: [
                        {
                            id: 'firstName',
                            name: 'firstName',
                            label: 'Prénom',
                            type: 'text',
                            placeholder: 'Prénom',
                            required: true,
                            value: this.user().firstName,
                            validation: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
                            order: 1
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            label: 'Nom',
                            type: 'text',
                            placeholder: 'Nom',
                            required: true,
                            value: this.user().lastName,
                            order: 2
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            label: 'Date de naissance',
                            type: 'date',
                            placeholder: 'Date de naissance',
                            required: true,
                            fullWidth: true,
                            value: new Date(this.user().dateOfBirth ?? ''),
                            order: 3
                        },
                        {
                            id: 'title',
                            name: 'title',
                            label: 'Titre',
                            type: 'text',
                            placeholder: 'Titre',
                            order: 5,
                            value: this.user().title,
                            fullWidth: true
                        },
                        {
                            id: 'description',
                            name: 'description',
                            label: 'Description',
                            type: 'textarea',
                            placeholder: 'Description',
                            value: this.user().description,
                            order: 6
                        },
                        {
                            id: 'phoneNumber',
                            name: 'phoneNumber',
                            label: 'Numéro de téléphone',
                            type: 'text',
                            placeholder: 'Numéro de téléphone',
                            value: this.user().phoneNumber ?? '',
                            order: 7,
                            fullWidth: true
                        }
                    ]
                },
                {
                    id: 'avatar',
                    name: 'avatar',
                    label: 'Avatar',
                    description: 'Veuillez remplir votre avatar',
                    fields: [
                        {
                            id: 'profilePicture',
                            name: 'profilePicture',
                            label: 'Image de profil',
                            type: 'file',
                            placeholder: 'Choisir votre image de profil',
                            accept: 'image/*',
                            maxFileSize: 1000000,
                            showCancelButton: true,
                            multiple: false,
                            mode: 'advanced',
                            chooseLabel: 'Choisir votre image',
                            uploadLabel: 'Téléverser',
                            cancelLabel: 'Annuler',
                            emptyMessage: 'Glissez et déposez votre image ici',
                            order: 1,
                            showUploadButton: true,
                            fullWidth: true,
                            url: this.user()?.imgUrl ? this.user()?.imgUrl! : 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/250px-User_icon_2.svg.png'
                        }
                    ]
                }
            ]
        };
    });

    ngOnInit() {
        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const teacherId = params['id'];
            if (teacherId && teacherId === 'me') {
                this.editMode.set(true);
                this.userId.set(this.userservice.userConnected().id);
            } else {
                this.userId.set(teacherId);
                this.editMode.set(false);
            }
            this.loadUserData();
        });
    }

    private async loadUserData() {
        try {
            const response = await this.userservice.getPublicInformations(this.userId());
            this.user.set(response.data as UserResponseDTO);
            await this.languagesService.loadLanguages();
            await this.languagesService.loadProgrammingLanguages();
            // charger les langues et langages de programmation de l'utilisateur
            await this.languagesService.getLanguageByUserId(this.userId());
            await this.languagesService.getProgrammingLanguageByUserId(this.userId());
            // charger les categories et les niveaux de cursus
            if (this.editMode()) {
                await this.cursusService.loadAllCategories();
                await this.cursusService.loadAllLevels();
            }
        } catch {}
    }

    editPersonnalInfosDialogVisible = model<boolean>(false);

    EditPersonnalInfos() {
        this.editPersonnalInfosDialogVisible.set(true);
    }

    async submit(event: FormGroup<any>) {
        try {
            const infos = event.value.personnalInfos;
            const updatedUser: UserUpdateDTO = {
                firstName: infos.firstName,
                lastName: infos.lastName,
                dateOfBirth: infos.dateOfBirth,
                title: infos.title,
                languagesIds: infos.languagesIds,
                programmingLanguagesIds: infos.programmingLanguagesIds,
                description: infos.description
            };
            await firstValueFrom(this.userservice.updatePersonnalInfos(updatedUser));

            // recharger les infos de l'utilisateur
            await this.loadUserData();
            await this.languagesService.getLanguageByUserId(this.user().id);
            await this.languagesService.getProgrammingLanguageByUserId(this.user().id);
            //fermer le popup
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la mise à jour des informations personnelles.' });
        } finally {
            this.editPersonnalInfosDialogVisible.set(false);
        }
    }
    cancel() {
        this.editPersonnalInfosDialogVisible.set(false);
    }
}

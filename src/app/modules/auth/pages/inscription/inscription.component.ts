import { Component, inject, linkedSignal, OnInit } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, firstValueFrom, tap } from 'rxjs';
import { EnumGender, GenderDropDown } from '../../../../shared/models/user';
import { ageValidator, passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { MessageService } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';

import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { CookieConsentService } from '../../../../shared/services/cookie-consent.service';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { GenderDTO, UserCreateDTO } from '../../../../../api';
import { MainGenderService } from '../../../../shared/services/main-gender.service';

@Component({
    selector: 'app-inscription',
    imports: [FluidModule, ButtonModule, PanelModule, TextareaModule, InputTextModule, DatePickerModule, SelectModule, CheckboxModule, ReactiveFormsModule, MessageModule, RouterModule, LogoComponent, ConfigurableFormComponent],

    templateUrl: './inscription.component.html',
    styleUrl: './inscription.component.scss',
    providers: []
})
export class InscriptionComponent implements OnInit {
    authService = inject(UserMainService);
    messageService = inject(MessageService);
    genderService = inject(MainGenderService);
    fb = inject(FormBuilder);
    router = inject(Router);
    cookieConsentService = inject(CookieConsentService);

    genders = this.genderService.genders;
    selectedGender = linkedSignal<GenderDTO | null>(() => {
        const genders = this.genders();
        return genders.length > 0 ? (genders.find((gender) => gender.name.toLowerCase() === 'other') ?? genders[0]) : null;
    });
    roleOptions = [
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b4a01',
            name: 'Etudiant',
            label: 'Etudiant'
        },
        {
            id: '87a0a5ed-c7bb-4394-a163-7ed7560b3703',
            name: 'Professeur',
            label: 'Professeur'
        }
    ];
    inscriptionFormStructure!: Structure;
    userForm!: FormGroup;

    ngOnInit(): void {
        this.loadData();
    }

    async loadData() {
        await this.genderService.getGenders();

        this.userForm = this.fb.group(
            {
                email: ['', [Validators.email, Validators.required]],
                password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
                confirmPassword: ['', [Validators.required]],
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                phoneNumber: [''],
                dateOfBirth: [new Date('1986-04-21'), [Validators.required, ageValidator()]],
                gender: [this.selectedGender()?.id, [Validators.required]],
                title: [''],
                role: [this.roleOptions[0].id, [Validators.required]],
                description: [''],
                privacyPolicyConsent: [false, [Validators.requiredTrue]],
                dataProcessingConsent: [false, [Validators.requiredTrue]]
            },
            { validators: [passwordValidator('password', 'confirmPassword')] }
        );

        this.inscriptionFormStructure = {
            id: 'inscriptionForm',
            name: 'inscriptionForm',
            label: 'Inscription',
            globalValidators: [Validators.required],
            styleClass: 'max-w-[40rem] ',
            hideCancelButton: true,
            hideSubmitButton: true,
            formFieldGroups: [
                {
                    id: 'inscriptionForm',
                    name: 'inscriptionForm',
                    label: 'Inscription',
                    fields: [
                        {
                            id: 'role',
                            name: 'role',
                            type: 'select',
                            label: "Je m'inscris en tant que",
                            displayKey: 'name',
                            compareKey: 'id',
                            required: true,
                            value: this.roleOptions[0].id,
                            placeholder: 'Choissir un rôle',
                            options: this.roleOptions,
                            fullWidth: true,
                            validation: [Validators.required]
                        },
                        {
                            id: 'firstName',
                            name: 'firstName',
                            type: 'text',
                            label: 'Prénom',
                            required: true,
                            placeholder: 'Prénom',
                            validation: [Validators.required]
                        },
                        {
                            id: 'lastName',
                            name: 'lastName',
                            type: 'text',
                            label: 'Nom',
                            required: true,
                            placeholder: 'Nom',
                            validation: [Validators.required]
                        },
                        {
                            id: 'email',
                            name: 'email',
                            type: 'email',
                            label: 'Email',
                            required: true,
                            placeholder: 'Email',
                            fullWidth: true,

                            validation: [Validators.email, Validators.required]
                        },
                        {
                            id: 'password',
                            name: 'password',
                            type: 'password',
                            label: 'Mot de passe',
                            required: true,
                            placeholder: 'Mot de passe',
                            validation: [Validators.required, passwordStrengthValidator()]
                        },
                        {
                            id: 'confirmPassword',
                            name: 'confirmPassword',
                            type: 'password',
                            label: 'Confirmer le mot de passe',
                            placeholder: 'Confirmer le mot de passe',
                            validation: [Validators.required]
                        },
                        {
                            id: 'dateOfBirth',
                            name: 'dateOfBirth',
                            type: 'date',
                            label: 'Date de naissance',
                            required: true,
                            placeholder: 'Date de naissance',
                            value: new Date('2000-01-01'),
                            validation: [Validators.required, ageValidator()]
                        },
                        {
                            id: 'gender',
                            name: 'gender',
                            label: 'Genre',
                            type: 'select',
                            placeholder: 'Genre',
                            required: true,
                            options: this.genders(),
                            value: this.selectedGender()?.id,
                            displayKey: 'name',
                            compareKey: 'id',
                            valueFormatter: (gender: any) => {
                                if (!gender || !gender.name) return '';

                                // Translate gender names from English to French
                                switch (gender.name.toLowerCase()) {
                                    case 'male':
                                        return 'Homme';
                                    case 'female':
                                        return 'Femme';
                                    case 'other':
                                        return 'Préfère ne pas dire';
                                    default:
                                        return gender.name;
                                }
                            }
                        }
                    ],
                    groupValidators: [passwordValidator('password', 'confirmPassword')]
                },
                {
                    id: 'optionalFields',
                    name: 'optionalFields',
                    label: 'Champs facultatifs',
                    fields: [
                        {
                            id: 'phoneNumber',
                            name: 'phoneNumber',
                            type: 'text',
                            label: 'Numéro de téléphone',
                            required: false,
                            placeholder: 'Numéro de téléphone'
                        },
                        {
                            id: 'title',
                            name: 'title',
                            type: 'text',
                            label: 'Titre',
                            required: false,
                            placeholder: 'Titre'
                        },
                        {
                            id: 'description',
                            name: 'description',
                            type: 'textarea',
                            label: 'Description',
                            required: false,
                            placeholder: 'Description'
                        }
                    ]
                },
                {
                    id: 'privacy',
                    name: 'privacy',
                    label: 'Consentements et confidentialité',
                    fields: [
                        {
                            id: 'privacyPolicyConsent',
                            name: 'privacyPolicyConsent',
                            type: 'checkbox',
                            label: "J'ai lu et j'accepte la politique de confidentialité",
                            required: true,
                            fullWidth: true,
                            validation: [Validators.requiredTrue]
                        },
                        {
                            id: 'dataProcessingConsent',
                            name: 'dataProcessingConsent',
                            type: 'checkbox',
                            label: "J'accepte que mes données personnelles soient traitées conformément au RGPD pour la création et la gestion de mon compte, ainsi que pour la fourniture des services de la plateforme.",
                            required: true,
                            fullWidth: true,
                            validation: [Validators.requiredTrue]
                        }
                    ]
                }
            ]
        };
    }

    async submit(e: FormGroup) {
        const formValue = e.value;

        const newUser: UserCreateDTO = {
            email: formValue.inscriptionForm.email,
            password: formValue.inscriptionForm.password,
            firstName: formValue.inscriptionForm.firstName,
            lastName: formValue.inscriptionForm.lastName,
            genderId: formValue.inscriptionForm.gender,
            dateOfBirth: formValue.inscriptionForm.dateOfBirth.toISOString(),
            phoneNumber: formValue.optionalFields.phoneNumber,
            title: formValue.optionalFields.title,
            description: formValue.optionalFields.description,
            privacyPolicyConsent: formValue.privacy.privacyPolicyConsent,
            dataProcessingConsent: formValue.privacy.dataProcessingConsent,
            roleId: formValue.inscriptionForm.role
        };

        try {
            await firstValueFrom(
                this.authService.register(newUser).pipe(
                    tap((res) => {
                        this.router.navigate(['auth/account-created-successfully']);
                    })
                )
            );
        } catch (err) {
            console.error(err);
            this.messageService.add({
                summary: 'Erreur',
                detail: (err as any).error.message,
                severity: 'error'
            });
        }
    }
}

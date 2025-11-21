import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { catchError } from 'rxjs';
import { UserMainService } from '../../../../shared/services/userMain.service';

import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { UserLoginDTO } from '../../../../../api';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';

@Component({
    selector: 'app-login',
    imports: [FluidModule, ButtonModule, ReactiveFormsModule, MessageModule, RouterModule, PasswordModule, InputTextModule, LogoComponent, ConfigurableFormComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: []
})
export class LoginComponent implements OnInit {
    private authService = inject(UserMainService);
    private messageService = inject(MessageService);
    router = inject(Router);
    badCredentials = false;
    ngOnInit(): void {}

    userForm = new FormGroup({
        email: new FormControl<string>('', [Validators.email, Validators.required]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });

    loginFormStructure: Structure = {
        id: 'login',
        name: 'login',
        label: 'Connexion',
        hideSubmitButton: true,
        hideCancelButton: true,
        styleClass: 'md:min-w-[40rem] min-w-[90vw] !p-0',
        formFieldGroups: [
            {
                id: 'login',
                name: 'login',
                description: 'Veuillez remplir les champs obligatoires',
                styleClass: 'w-full',
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email',
                        type: 'text',
                        placeholder: 'Email',
                        required: true,
                        fullWidth: true,
                        validation: [Validators.email, Validators.required]
                    },
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        placeholder: 'Mot de passe',
                        required: true,
                        fullWidth: true,
                        validation: [Validators.required, Validators.minLength(8)]
                    }
                ]
            }
        ]
    };

    // Handle form submission from configurable form
    handleFormSubmit(formGroup: FormGroup) {
        const formData = formGroup.value;
        const loginData = {
            email: formData.login.email,
            password: formData.login.password
        };

        this.loginWithData(loginData);
    }

    // Original submit method (now private)
    private loginWithData(loginData: UserLoginDTO) {
        this.authService
            .login(loginData)
            .pipe(
                catchError((err) => {
                    this.messageService.add({
                        summary: 'Erreur',
                        detail: 'Mauvais identifiants',
                        severity: 'error'
                    });
                    this.badCredentials = true;
                    throw err;
                })
            )
            .subscribe(() => {
                this.messageService.add({
                    summary: 'Connexion réussie',
                    detail: `Bienvenue`,
                    severity: 'success',
                    life: 500,
                    icon: 'pi pi-check-circle'
                });

                this.router.navigate(['/']);
            });
    }

    // Keep the original submit method for backward compatibility (if needed)
    submit() {
        this.loginWithData(this.userForm.value as UserLoginDTO);
    }
}

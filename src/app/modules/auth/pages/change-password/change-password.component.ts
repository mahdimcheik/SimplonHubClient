import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordStrengthValidator, passwordValidator } from '../../../../shared/validators/confirmPasswordValidator';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, finalize, firstValueFrom, tap } from 'rxjs';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RequiredAsteriskDirective } from '../../../../shared/directives/required-asterisk.directive';

import { MessageService } from 'primeng/api';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { Structure } from '../../../../generic-components/configurable-form/related-models';
import { PasswordRecoveryInput } from '../../../../../api';
@Component({
    selector: 'app-change-password',
    imports: [FluidModule, ButtonModule, PasswordModule, InputTextModule, ConfigurableFormComponent, MessageModule, InputTextModule, ToastModule, SelectModule, PasswordModule, FormsModule, ReactiveFormsModule, LogoComponent],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
    providers: []
})
export class ChangePasswordComponent implements OnInit {
    visible: boolean = false;
    private authService = inject(UserMainService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    changePasswordFormStructure: Structure = {
        id: 'changePasswordForm',
        name: 'changePasswordForm',
        label: 'Réinitialiser votre mot de passe',
        globalValidators: [Validators.required],
        styleClass: 'min-w-[30rem] ',
        formFieldGroups: [
            {
                id: 'password',
                name: 'password',
                label: 'Mot de passe',
                fields: [
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Mot de passe',
                        type: 'password',
                        required: true,
                        placeholder: 'Mot de passe',
                        order: 1
                    },
                    {
                        id: 'passwordConfirmation',
                        name: 'passwordConfirmation',
                        label: 'Confirmer votre mot de passe',
                        type: 'password',
                        required: true,
                        placeholder: 'Confirmer votre mot de passe',
                        order: 2
                    }
                ]
            }
        ]
    };

    userForm = new FormGroup(
        {
            userId: new FormControl<string>(''),
            resetToken: new FormControl<string>(''),
            password: new FormControl<string>('', [Validators.required, Validators.minLength(8), passwordStrengthValidator]),
            passwordConfirmation: new FormControl<string>('', [Validators.required])
        },
        { validators: [passwordValidator('password', 'passwordConfirmation')] }
    );

    ngOnInit(): void {
        let userId = this.activatedRoute.snapshot.queryParams['userId'] ?? '';
        let resetToken = this.activatedRoute.snapshot.queryParams['resetToken'] ?? '';
        this.userForm.setValue({
            userId: userId,
            resetToken: resetToken,
            password: '',
            passwordConfirmation: ''
        });
    }

    async submit(e: FormGroup) {
        await firstValueFrom(
            this.authService.resetPassword(e.value as PasswordRecoveryInput).pipe(
                tap((res) => {
                    this.router.navigate(['/']);
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe réinitialisé avec succès' });
                    this.router.navigate(['/auth/password-reset-successfully']);
                })
            )
        );
    }
}

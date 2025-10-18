import { Component, inject, signal } from '@angular/core';
import { UserMainService } from '../../../../shared/services/userMain.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

import { MessageModule } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';
import { ConfigurableFormComponent } from '../../../../generic-components/configurable-form/configurable-form.component';
import { Structure } from '../../../../generic-components/configurable-form/related-models';

@Component({
    selector: 'app-forgot-password',
    imports: [FluidModule, ButtonModule, ConfigurableFormComponent, ReactiveFormsModule, MessageModule, RouterModule, LogoComponent],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    providers: []
})
export class ForgotPasswordComponent {
    authService = inject(UserMainService);
    messageService = inject(MessageService);
    router = inject(Router);

    forgotPasswordFormStructure: Structure = {
        id: 'forgotPasswordForm',
        name: 'forgotPasswordForm',
        label: 'Mot de passe oublié',
        globalValidators: [Validators.required],
        styleClass: 'min-w-[25rem] ',
        hideSubmitButton: true,
        hideCancelButton: true,
        formFields: [
            {
                id: 'email',
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Entrer votre email',
                validation: [Validators.email, Validators.required],
                fullWidth: true
            }
        ]
    };

    submit(e: FormGroup) {
        const email = e.value.email;
        this.authService.forgotPassword({ email }).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Un email vous a été envoyé pour réinitialiser votre mot de passe' });
            this.router.navigate(['/auth/login']);
        });
    }

    cancel() {
        this.router.navigate(['/auth/login']);
    }
}

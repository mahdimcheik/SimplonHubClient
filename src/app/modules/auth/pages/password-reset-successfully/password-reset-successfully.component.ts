import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { LogoComponent } from '../../../../pages/landing/components/logo/logo.component';

@Component({
    selector: 'app-password-reset-successfully',
    imports: [FluidModule, ButtonModule, LogoComponent],
    templateUrl: './password-reset-successfully.component.html',
    styleUrl: './password-reset-successfully.component.scss'
})
export class PasswordResetSuccessfullyComponent {
    router = inject(Router);

    goToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
